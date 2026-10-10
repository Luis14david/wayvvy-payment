async function leer(db, bloquear = false) {
    const [filas] = await db.query(`SELECT domingo_habilitado FROM configuracion_asistencia
        WHERE id_configuracion = 1${bloquear ? ' LOCK IN SHARE MODE' : ''}`);
    if (!filas.length) throw new Error('Falta preparar la configuración de asistencia.');
    return { domingo_habilitado: filas[0].domingo_habilitado === 1 };
}
function registrar(app, conexion) {
    const db = conexion.promise();
    app.get('/api/configuracion-asistencia', async (req, res) => {
        try { res.json(await leer(db)); }
        catch (error) {
            console.error('Error al consultar configuración de asistencia:', error);
            res.status(500).json({ error: 'No se pudo cargar la configuración de asistencia. Revise la instalación de preparar-domingo.sql.' });
        }
    });
    app.put('/api/configuracion-asistencia', async (req, res) => {
        if (req.cuenta?.rol !== 'admin') return res.status(403).json({ error: 'Solo el administrador puede habilitar el domingo.' });
        if (typeof req.body?.domingo_habilitado !== 'boolean') {
            return res.status(400).json({ error: 'Indique si el domingo está habilitado.' });
        }
        try {
            const [resultado] = await db.query(`UPDATE configuracion_asistencia SET domingo_habilitado = ?
                WHERE id_configuracion = 1`, [req.body.domingo_habilitado ? 1 : 0]);
            if (!resultado.affectedRows) throw new Error('Falta la configuración de asistencia.');
            res.json({ domingo_habilitado: req.body.domingo_habilitado });
        } catch (error) {
            console.error('Error al guardar configuración de asistencia:', error);
            res.status(500).json({ error: 'No se pudo guardar la configuración de asistencia.' });
        }
    });
}
module.exports = { leer, registrar };
