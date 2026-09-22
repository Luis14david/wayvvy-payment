// Validación de fechas y minutos de asistencia.
function fechaValida(fecha) {
    if (typeof fecha !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(fecha)) return false;
    const dia = new Date(`${fecha}T00:00:00Z`);
    return Number.isFinite(dia.getTime()) && dia.toISOString().slice(0, 10) === fecha;
}

function validarRegistros(idEmpleado, registros) {
    if (!/^[1-9]\d*$/.test(String(idEmpleado)) || !Number.isSafeInteger(Number(idEmpleado))) {
        throw new Error('Seleccione un empleado válido.');
    }
    if (!Array.isArray(registros) || registros.length < 1 || registros.length > 31) {
        throw new Error('Debe enviar entre 1 y 31 días.');
    }
    const fechas = new Set();
    for (const registro of registros) {
        if (!registro || !fechaValida(registro.fecha) || fechas.has(registro.fecha)) {
            throw new Error('Las fechas deben ser válidas y no repetirse.');
        }
        fechas.add(registro.fecha);
        const { minutos_regulares: regulares, minutos_extras: extras } = registro;
        if (!Number.isInteger(regulares) || !Number.isInteger(extras) ||
            regulares < 0 || extras < 0 || regulares + extras > 1440) {
            throw new Error('Use minutos enteros no negativos, con un máximo de 24 horas por día.');
        }
        if (new Date(`${registro.fecha}T00:00:00Z`).getUTCDay() === 0 && regulares + extras > 0) {
            throw new Error('El domingo es un día libre.');
        }
    }
    const ordenadas = [...fechas].sort();
    if ((new Date(ordenadas.at(-1)) - new Date(ordenadas[0])) / 86400000 > 30) {
        throw new Error('El rango no puede superar 31 días.');
    }
}

module.exports = function registrarAsistencia(app, conexion) {
    // Consultar los minutos originales y las horas usadas por reportes anteriores.
    app.get('/api/asistencia', (req, res) => {
        const { id_empleado, fecha_inicio, fecha_fin } = req.query;
        if (!/^[1-9]\d*$/.test(String(id_empleado)) || !fechaValida(fecha_inicio) ||
            !fechaValida(fecha_fin) || fecha_fin < fecha_inicio) {
            return res.status(400).json({ error: 'Empleado o fechas inválidos.' });
        }
        conexion.query(`SELECT id_asistencia, id_empleado,
            DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha,
            minutos_regulares, minutos_extras,
            minutos_regulares / 60 AS horas_trabajadas,
            minutos_extras / 60 AS horas_extras, estado, observacion
            FROM asistencia WHERE id_empleado = ? AND fecha BETWEEN ? AND ?
            ORDER BY fecha`, [id_empleado, fecha_inicio, fecha_fin], (error, filas) => {
            if (error) {
                console.error('Error al consultar asistencia:', error);
                return res.status(500).json({ error: 'No se pudo cargar la asistencia.' });
            }
            res.json(filas);
        });
    });

    // Guardar todos los días en una sola transacción.
    app.post('/api/asistencia', async (req, res) => {
        const { id_empleado, registros } = req.body || {};
        try {
            validarRegistros(id_empleado, registros);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
        let db;
        try {
            db = await conexion.promise().getConnection();
            await db.beginTransaction();
            const [empleados] = await db.query('SELECT id_empleado FROM empleados WHERE id_empleado = ?', [id_empleado]);
            if (!empleados.length) {
                await db.rollback();
                return res.status(404).json({ error: 'El empleado no existe.' });
            }
            for (const registro of registros) {
                const { fecha, minutos_regulares: regulares, minutos_extras: extras } = registro;
                // Los domingos históricos se conservan sin modificarlos.
                if (new Date(`${fecha}T00:00:00Z`).getUTCDay() === 0) continue;
                if (regulares + extras === 0) {
                    // Conservar observaciones y estados de ausencias o permisos.
                    await db.query(`UPDATE asistencia SET minutos_regulares = 0, minutos_extras = 0,
                        horas_trabajadas = 0, horas_extras = 0
                        WHERE id_empleado = ? AND fecha = ?`, [id_empleado, fecha]);
                    continue;
                }
                await db.query(`INSERT INTO asistencia
                    (id_empleado, fecha, minutos_regulares, minutos_extras, horas_trabajadas, horas_extras, estado)
                    VALUES (?, ?, ?, ?, ?, ?, 'Presente')
                    ON DUPLICATE KEY UPDATE minutos_regulares = VALUES(minutos_regulares),
                    minutos_extras = VALUES(minutos_extras), horas_trabajadas = VALUES(horas_trabajadas),
                    horas_extras = VALUES(horas_extras)`,
                    [id_empleado, fecha, regulares, extras, regulares / 60, extras / 60]);
            }
            await db.commit();
            res.json({ mensaje: 'Horas y minutos guardados correctamente.' });
        } catch (error) {
            if (db) {
                try { await db.rollback(); } catch (rollbackError) {
                    console.error('Error al revertir asistencia:', rollbackError);
                }
            }
            console.error('Error al guardar asistencia:', error);
            res.status(500).json({ error: 'No se pudieron guardar las horas y minutos.' });
        } finally {
            if (db) db.release();
        }
    });
};

module.exports.validarRegistros = validarRegistros;
