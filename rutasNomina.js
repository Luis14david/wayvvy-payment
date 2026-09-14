// Crear períodos y consultar el detalle registrado de una nómina.
module.exports = function registrarRutasNomina(app, conexion) {
    const db = conexion.promise();

    function fechaValida(valor) {
        if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
        const fecha = new Date(valor + 'T00:00:00Z');
        return valor >= '1000-01-01' && Number.isFinite(fecha.getTime()) &&
            fecha.toISOString().slice(0, 10) === valor;
    }

    app.post('/api/nominas', async (req, res) => {
        const { periodo_inicio, periodo_fin, fecha_pago } = req.body || {};
        if (![periodo_inicio, periodo_fin, fecha_pago].every(fechaValida)) {
            return res.status(400).json({ error: 'Complete las tres fechas con valores válidos.' });
        }
        if (periodo_fin < periodo_inicio) {
            return res.status(400).json({ error: 'La fecha final no puede ser anterior a la inicial.' });
        }
        try {
            const [resultado] = await db.query(
                `INSERT INTO nomina
                    (periodo_inicio, periodo_fin, fecha_pago, anio, estado)
                 VALUES (?, ?, ?, ?, 'Borrador')`,
                [periodo_inicio, periodo_fin, fecha_pago, Number(fecha_pago.slice(0, 4))]
            );
            res.status(201).json({ id_nomina: resultado.insertId, estado: 'Borrador' });
        } catch (error) {
            console.error('Error al crear nómina:', error);
            res.status(500).json({ error: 'No se pudo crear la nómina.' });
        }
    });

    app.get('/api/nominas/:id', async (req, res) => {
        const id = Number(req.params.id);
        if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({ error: 'El identificador de nómina no es válido.' });
        }
        try {
            const [nominas] = await db.query(
                `SELECT id_nomina, periodo_inicio, periodo_fin, fecha_pago, anio,
                        estado, total_bruto, total_deducciones, total_neto
                 FROM nomina WHERE id_nomina = ?`, [id]
            );
            if (!nominas.length) return res.status(404).json({ error: 'La nómina no existe.' });
            const [detalles] = await db.query(
                `SELECT dn.id_detalle, dn.id_empleado, e.nombres, e.apellidos,
                        dn.salario_bruto, dn.total_ingresos,
                        dn.total_deducciones, dn.salario_neto
                 FROM detalle_nomina dn
                 LEFT JOIN empleados e ON e.id_empleado = dn.id_empleado
                 WHERE dn.id_nomina = ? ORDER BY dn.id_detalle`, [id]
            );
            res.json({ nomina: nominas[0], detalles });
        } catch (error) {
            console.error('Error al consultar nómina:', error);
            res.status(500).json({ error: 'No se pudo consultar la nómina.' });
        }
    });
};
