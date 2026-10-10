module.exports = function registrarRutasIncentivos(app, conexion) {
    const pool = conexion.promise();
    function idValido(valor) {
        return /^\d+$/.test(String(valor ?? '')) && Number.isSafeInteger(Number(valor)) && Number(valor) > 0 && Number(valor) <= 2147483647;
    }
    function datosValidos(body) {
        return /^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(String(body.monto ?? '')) &&
            Number(body.monto) > 0 && (body.descripcion == null ||
                (typeof body.descripcion === 'string' && [...body.descripcion.trim()].length <= 255));
    }
    function fallo(status, message) {
        return Object.assign(new Error(message), { status });
    }
    async function modificar(req, res, accion) {
        const body = req.body || {};
        if (accion === 'crear' ? !idValido(body.id_empleado) || !idValido(body.id_nomina) : !idValido(req.params.id)) {
            return res.status(400).json({ error: 'Identificador inválido.' });
        }
        if (accion !== 'borrar' && !datosValidos(body)) {
            return res.status(400).json({ error: 'Ingrese un monto positivo de hasta 12 enteros y 2 decimales y una descripción de hasta 255 caracteres.' });
        }
        let db;
        try {
            db = await pool.getConnection();
            await db.beginTransaction();
            let idNomina = body.id_nomina;
            if (accion !== 'crear') {
                const [filas] = await db.query('SELECT id_nomina FROM incentivos WHERE id_incentivo = ?', [req.params.id]);
                if (!filas.length) throw fallo(404, 'El incentivo no existe.');
                idNomina = filas[0].id_nomina;
            }
            const [nominas] = await db.query('SELECT estado FROM nomina WHERE id_nomina = ? FOR UPDATE', [idNomina]);
            if (!nominas.length) throw fallo(404, 'La nómina seleccionada no existe.');
            if (nominas[0].estado !== 'Borrador') throw fallo(409, 'Los incentivos se pueden modificar antes de guardar los resultados de la nómina.');
            let idIncentivo = Number(req.params.id);
            if (accion === 'crear') {
                const [empleados] = await db.query('SELECT id_empleado FROM empleados WHERE id_empleado = ? LOCK IN SHARE MODE', [body.id_empleado]);
                if (!empleados.length) throw fallo(404, 'El empleado seleccionado no existe.');
                const [resultado] = await db.query(`INSERT INTO incentivos (id_empleado, id_nomina, monto, descripcion)
                    VALUES (?, ?, ?, ?)`, [body.id_empleado, idNomina, String(body.monto), body.descripcion?.trim() || null]);
                idIncentivo = resultado.insertId;
            } else {
                const [filas] = await db.query('SELECT id_incentivo FROM incentivos WHERE id_incentivo = ? AND id_nomina = ? FOR UPDATE', [idIncentivo, idNomina]);
                if (!filas.length) throw fallo(404, 'El incentivo no existe.');
                if (accion === 'editar') {
                    await db.query('UPDATE incentivos SET monto = ?, descripcion = ? WHERE id_incentivo = ?',
                        [String(body.monto), body.descripcion?.trim() || null, idIncentivo]);
                } else {
                    await db.query('DELETE FROM incentivos WHERE id_incentivo = ?', [idIncentivo]);
                }
            }
            await db.commit();
            res.status(accion === 'crear' ? 201 : 200).json({ id_incentivo: idIncentivo,
                mensaje: accion === 'crear' ? 'Incentivo guardado correctamente' : accion === 'editar' ? 'Incentivo actualizado correctamente' : 'Incentivo eliminado correctamente' });
        } catch (error) {
            if (db) { try { await db.rollback(); } catch (falloRollback) { console.error('Error al revertir incentivo:', falloRollback); } }
            if (!error.status) console.error('Error al guardar incentivo:', error);
            res.status(error.status || 500).json({ error: error.status ? error.message : 'No se pudo guardar el incentivo.' });
        } finally { if (db) db.release(); }
    }
    app.get('/api/incentivos', async (req, res) => {
        if (!idValido(req.query.id_empleado) || !idValido(req.query.id_nomina)) {
            return res.status(400).json({ error: 'Seleccione un empleado y una nómina válidos.' });
        }
        try {
            const [filas] = await pool.query(`SELECT id_incentivo, id_empleado, id_nomina, monto, descripcion, fecha_registro
                FROM incentivos WHERE id_empleado = ? AND id_nomina = ? ORDER BY id_incentivo DESC`,
                [req.query.id_empleado, req.query.id_nomina]);
            res.json(filas);
        } catch (error) {
            console.error('Error al consultar incentivos:', error);
            res.status(500).json({ error: 'No se pudieron cargar los incentivos.' });
        }
    });
    app.post('/api/incentivos', (req, res) => modificar(req, res, 'crear'));
    app.put('/api/incentivos/:id', (req, res) => modificar(req, res, 'editar'));
    app.delete('/api/incentivos/:id', (req, res) => modificar(req, res, 'borrar'));
};
