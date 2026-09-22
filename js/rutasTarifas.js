const { validarFecha, validarMonto, validarCambio, fechaInicioPermitida } = require('./tarifas');

module.exports = function registrarTarifas(app, conexion) {
    async function transaccion(res, operacion) {
        let db;
        try {
            db = await conexion.promise().getConnection();
            await db.beginTransaction();
            const resultado = await operacion(db);
            await db.commit();
            res.json(resultado);
        } catch (error) {
            if (db) {
                try { await db.rollback(); } catch (fallo) { console.error('Error al revertir empleado:', fallo); }
            }
            if (!error.status) console.error('Error al guardar empleado o tarifa:', error);
            res.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo guardar. No se aplicaron los cambios.' });
        } finally {
            if (db) db.release();
        }
    }

    function rechazar(mensaje, status = 400) {
        const error = new Error(mensaje);
        error.status = status;
        throw error;
    }

    function validarDatos(datos, cedulaGuardada) {
        if (!datos || typeof datos !== 'object') rechazar('No se recibieron los datos del empleado.');
        if (typeof datos.nombres !== 'string' || !datos.nombres.trim()) rechazar('Complete el nombre.');
        if (typeof datos.apellidos !== 'string' || !datos.apellidos.trim()) rechazar('Complete el apellido.');

        // Una edición de tarifa no debe alterar ni exigir corregir la cédula histórica.
        const conservaCedula = cedulaGuardada !== undefined && datos.cedula === cedulaGuardada;
        if (!conservaCedula) {
            if (typeof datos.cedula !== 'string' || !/^[0-9\s-]+$/.test(datos.cedula)) {
                rechazar('La cédula nueva debe contener 11 dígitos; puede escribirla con guiones.');
            }
            const cedula = datos.cedula.replace(/[\s-]/g, '');
            if (!/^\d{11}$/.test(cedula)) rechazar('La cédula nueva debe contener exactamente 11 dígitos.');
            datos.cedula = cedula;
        }
        if (!validarFecha(datos.fecha_ingreso)) rechazar('Seleccione una fecha de ingreso válida.');
        if (!/^[1-9]\d*$/.test(String(datos.id_puesto || ''))) rechazar('Seleccione un puesto.');
        if (!['femenino', 'masculino'].includes(String(datos.sexo || '').toLowerCase())) {
            rechazar('En sexo, escriba Femenino o Masculino.');
        }
        if (!['activo', 'inactivo', 'suspendido', 'licencia', 'vacaciones'].includes(String(datos.estado || '').toLowerCase())) {
            rechazar('Seleccione un estado válido para el empleado.');
        }
        if (datos.nacimiento && !validarFecha(datos.nacimiento)) rechazar('Revise la fecha de nacimiento.');
    }

    function valoresPersonales(datos) {
        return [datos.nombres.trim(), datos.apellidos.trim(), datos.cedula, datos.sexo,
            datos.nacimiento || null, datos.telefono || null, datos.correo || null,
            datos.direccion || null, datos.fecha_ingreso, datos.id_puesto, datos.estado];
    }

    // Consultar el historial completo o la tarifa de una fecha determinada.
    app.get('/api/empleados/:id/tarifas', async (req, res) => {
        if (!/^[1-9]\d*$/.test(req.params.id) || (req.query.fecha && !validarFecha(req.query.fecha))) {
            return res.status(400).json({ error: 'Empleado o fecha inválidos.' });
        }
        try {
            const [filas] = await conexion.promise().query(`SELECT id_historial, id_empleado,
                DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
                salario AS tarifa_hora, motivo_cambio FROM historial_salario
                WHERE id_empleado = ? ${req.query.fecha ? 'AND fecha_inicio <= ?' : ''}
                ORDER BY fecha_inicio DESC ${req.query.fecha ? 'LIMIT 1' : ''}`,
                req.query.fecha ? [req.params.id, req.query.fecha] : [req.params.id]);
            if (req.query.fecha && !filas.length) {
                return res.status(422).json({ error: 'No hay tarifa confirmada para esa fecha.' });
            }
            res.json(req.query.fecha ? filas[0] : filas);
        } catch (error) {
            console.error('Error al consultar tarifas:', error);
            res.status(500).json({ error: 'No se pudo consultar el historial de tarifas.' });
        }
    });

    // El alta del empleado y su primera tarifa se guardan juntos.
    app.post('/registrar', async (req, res) => {
        await transaccion(res, async db => {
            const datos = req.body;
            validarDatos(datos);
            let tarifa;
            try {
                tarifa = validarCambio({ monto: datos.salario_base, fecha: datos.fecha_tarifa,
                    motivo: 'Tarifa inicial al registrar el empleado', ingreso: datos.fecha_ingreso });
            } catch (error) { rechazar(error.message); }
            // El índice único evita duplicar el número ante dos altas simultáneas.
            const [numeros] = await db.query('SELECT COALESCE(MAX(numero_empleado), 0) + 1 AS siguiente FROM empleados');
            const valores = valoresPersonales(datos);
            const [resultado] = await db.query(`INSERT INTO empleados
                (numero_empleado, nombres, apellidos, cedula, sexo, fecha_nacimiento,
                 telefono, correo, direccion, fecha_ingreso, id_puesto, estado, salario_base)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [numeros[0].siguiente, ...valores, tarifa.tarifa]);
            await db.query(`INSERT INTO historial_salario
                (id_empleado, fecha_inicio, salario, motivo_cambio, registrado_por) VALUES (?, ?, ?, ?, NULL)`,
                [resultado.insertId, tarifa.fecha, tarifa.tarifa, tarifa.motivo]);
            return { mensaje: 'Empleado y tarifa inicial guardados.', id_empleado: resultado.insertId };
        });
    });

    // Editar los datos personales no reemplaza la tarifa anterior.
    app.put('/api/empleados/:id', async (req, res) => {
        await transaccion(res, async db => {
            if (!/^[1-9]\d*$/.test(req.params.id)) rechazar('Empleado inválido.');
            const datos = req.body;
            const [empleados] = await db.query('SELECT id_empleado, cedula FROM empleados WHERE id_empleado = ? FOR UPDATE', [req.params.id]);
            if (!empleados.length) rechazar('Empleado no encontrado.', 404);
            validarDatos(datos, empleados[0].cedula);
            const [historial] = await db.query(`SELECT id_historial, salario,
                DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio
                FROM historial_salario WHERE id_empleado = ? ORDER BY fecha_inicio DESC`, [req.params.id]);
            if (!historial.length) rechazar('Falta inicializar el historial de este empleado.', 409);
            if (Number(datos.id_historial_esperado) !== historial[0].id_historial) {
                rechazar('El historial cambió mientras editabas. Recarga el empleado antes de guardar.', 409);
            }
            if (fechaInicioPermitida(datos.fecha_ingreso) > historial.at(-1).fecha_inicio) {
                rechazar('La fecha de ingreso no puede quedar después de una tarifa ya registrada.');
            }
            if (datos.nueva_tarifa !== undefined && datos.nueva_tarifa !== '') {
                let tarifa;
                try {
                    tarifa = validarCambio({ monto: datos.nueva_tarifa, fecha: datos.fecha_tarifa,
                        motivo: datos.motivo_tarifa, ingreso: datos.fecha_ingreso, ultimaFecha: historial[0].fecha_inicio });
                    if (tarifa.tarifa === validarMonto(historial[0].salario)) throw new Error('La nueva tarifa debe ser distinta de la última registrada.');
                } catch (error) { rechazar(error.message); }
                // No alterar períodos que ya contienen nóminas cerradas para este empleado.
                const [cerradas] = await db.query(`SELECT n.id_nomina FROM nomina n
                    INNER JOIN detalle_nomina d ON d.id_nomina = n.id_nomina
                    WHERE d.id_empleado = ? AND n.estado IN ('Procesada', 'Pagada')
                    AND n.periodo_fin >= ? LIMIT 1`, [req.params.id, tarifa.fecha]);
                if (cerradas.length) rechazar('La fecha afectaría una nómina procesada o pagada. Elija una fecha posterior.', 409);
                await db.query(`INSERT INTO historial_salario
                    (id_empleado, fecha_inicio, salario, motivo_cambio, registrado_por) VALUES (?, ?, ?, ?, NULL)`,
                    [req.params.id, tarifa.fecha, tarifa.tarifa, tarifa.motivo]);
            }
            await db.query(`UPDATE empleados SET nombres = ?, apellidos = ?, cedula = ?, sexo = ?,
                fecha_nacimiento = ?, telefono = ?, correo = ?, direccion = ?, fecha_ingreso = ?,
                id_puesto = ?, estado = ? WHERE id_empleado = ?`, [...valoresPersonales(datos), req.params.id]);
            // Copia compatible del monto vigente; el historial es la fuente por fecha.
            await db.query(`UPDATE empleados SET salario_base = COALESCE((SELECT h.salario
                FROM historial_salario h WHERE h.id_empleado = empleados.id_empleado
                AND h.fecha_inicio <= CURDATE() ORDER BY h.fecha_inicio DESC LIMIT 1), salario_base)
                WHERE id_empleado = ?`, [req.params.id]);
            return { mensaje: 'Empleado actualizado. El historial anterior se conservó.' };
        });
    });
};
