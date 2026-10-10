const { cargar: cargarTasas } = require('./tasasDescuentos');
const { calcularRegulares, resumirNomina, rangoDescuentos, resumirDescuentos } = require('./calculoNomina');
const { calcularSemana } = require('./fechasNomina');
const servicio = require('./guardarNomina');

// Crear períodos y consultar el detalle registrado de una nómina.
module.exports = function registrarRutasNomina(app, conexion) {
    const db = conexion.promise();

    // Consulta por fecha trabajada; no registra pagos ni retenciones.
    app.get('/api/reportes/calculo', async (req,res) => {
        const {id_empleado,fecha_inicio:inicio,fecha_fin:fin} = req.query;
        try {
            if (!/^\d+$/.test(id_empleado || '') || !Number.isSafeInteger(Number(id_empleado)) || Number(id_empleado)<1) throw new Error('Empleado inválido.');
            calcularRegulares([], {inicio,fin});
            if (Number(fin.slice(0,4))-Number(inicio.slice(0,4))>1) throw new Error('Seleccione un rango de hasta un año.');
        } catch(error) {return res.status(400).json({error:error.message});}
        try {
            const desde = inicio.slice(0,7)+'-01';
            const [registros] = await db.query(`SELECT a.id_empleado, e.numero_empleado, e.nombres, e.apellidos,
                    DATE_FORMAT(a.fecha, '%Y-%m-%d') AS fecha,
                    a.minutos_regulares, a.minutos_extras,
                    h.salario AS tarifa_hora,
                    DATE_FORMAT(h.fecha_inicio, '%Y-%m-%d') AS tarifa_desde
                FROM asistencia a
                INNER JOIN empleados e ON e.id_empleado = a.id_empleado
                LEFT JOIN historial_salario h ON h.id_historial = (
                    SELECT h2.id_historial FROM historial_salario h2
                    WHERE h2.id_empleado = a.id_empleado AND h2.fecha_inicio <= a.fecha
                    ORDER BY h2.fecha_inicio DESC, h2.id_historial DESC LIMIT 1
                )
                WHERE a.id_empleado = ? AND a.fecha BETWEEN DATE_SUB(?, INTERVAL WEEKDAY(?) DAY)
                    AND DATE_ADD(?, INTERVAL (6 - WEEKDAY(?)) DAY)
                  AND (a.minutos_regulares > 0 OR a.minutos_extras > 0
                       OR a.minutos_regulares IS NULL OR a.minutos_extras IS NULL)
                ORDER BY e.numero_empleado, a.fecha
            `,[id_empleado,desde,desde,fin,fin]);
            res.json(require('./calculoNomina').calcularReporte(registros,inicio,fin,await cargarTasas(db)));
        } catch(error) {
            res.status(422).json({error:error.codigo === 'TASAS_NO_CONFIGURADAS' ? error.message : 'No se pudo calcular el período. Revise los minutos y las tarifas históricas.'});
        }
    });


    app.post('/api/nominas', async (req, res) => {
        let semana;
        try {
            semana = calcularSemana(req.body?.periodo_inicio);
            if (req.body.periodo_fin !== undefined && req.body.periodo_fin !== semana.periodo_fin) {
                throw new Error('El período debe terminar el domingo de la misma semana.');
            }
            if (req.body.fecha_pago !== undefined && req.body.fecha_pago !== semana.fecha_pago) {
                throw new Error(`La fecha de pago correspondiente es ${semana.fecha_pago}. Actualice el formulario.`);
            }
        } catch (error) { return res.status(400).json({ error: error.message }); }
        const { periodo_inicio, periodo_fin, fecha_pago } = semana;
        try {
            const [resultado] = await db.query(
                `INSERT INTO nomina
                    (periodo_inicio, periodo_fin, fecha_pago, anio, estado)
                    VALUES (?, ?, ?, ?, 'Borrador')`,
                [periodo_inicio, periodo_fin, fecha_pago, Number(fecha_pago.slice(0, 4))]
            );
            res.status(201).json({ id_nomina: resultado.insertId, estado: 'Borrador', ...semana });
        } catch (error) {
            console.error('Error al crear nómina:', error);
            res.status(500).json({ error: 'No se pudo crear la nómina.' });
        }
    });

    // Actualizar la fecha de pago antes de guardar el cálculo.
    app.patch('/api/nominas/:id/fecha-pago', async (req, res) => {
        const id = Number(req.params.id);
        if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({ error: 'El identificador de nómina no es válido.' });
        }
        let conexionNomina;
        try {
            conexionNomina = await db.getConnection();
            await conexionNomina.beginTransaction();
            const [filas] = await conexionNomina.query(`SELECT estado,
                DATE_FORMAT(periodo_inicio, '%Y-%m-%d') AS periodo_inicio,
                DATE_FORMAT(periodo_fin, '%Y-%m-%d') AS periodo_fin
                FROM nomina WHERE id_nomina = ? FOR UPDATE`, [id]);
            if (!filas.length || filas[0].estado !== 'Borrador') {
                await conexionNomina.rollback();
                return res.status(filas.length ? 409 : 404).json({ error: filas.length ?
                    'Solo se puede corregir la fecha mientras los resultados no estén guardados.' : 'La nómina no existe.' });
            }
            let semana;
            try {
                semana = calcularSemana(filas[0].periodo_inicio);
                if (semana.periodo_fin !== filas[0].periodo_fin) throw new Error('El período guardado no corresponde a una semana completa de lunes a domingo.');
            } catch (error) {
                await conexionNomina.rollback();
                return res.status(400).json({ error: error.message });
            }
            await conexionNomina.query('UPDATE nomina SET fecha_pago = ?, anio = ? WHERE id_nomina = ?',
                [semana.fecha_pago, Number(semana.fecha_pago.slice(0, 4)), id]);
            await conexionNomina.commit();
            res.json({ mensaje: 'Fecha de pago corregida.', ...semana });
        } catch (error) {
            if (conexionNomina) {
                try { await conexionNomina.rollback(); } catch (fallo) { console.error('Error al revertir la fecha:', fallo); }
            }
            console.error('Error al corregir la fecha de pago:', error);
            res.status(500).json({ error: 'No se pudo corregir la fecha de pago.' });
        } finally { if (conexionNomina) conexionNomina.release(); }
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
            const calculoGuardado = await servicio.guardado(db, id);
            const pagos = new Map((calculoGuardado?.pagos || []).map(p => [String(p.id_empleado), p]));
            const registrados = calculoGuardado ? detalles.filter(d => pagos.has(String(d.id_empleado)))
                .map(d => ({ ...d, nombre: pagos.get(String(d.id_empleado)).nombre })) : detalles;
            res.json({ nomina: nominas[0], detalles: registrados,
                calculo_guardado: calculoGuardado, fecha_calculo: calculoGuardado?.fecha_calculo || null });
        } catch (error) {
            console.error('Error al consultar nómina:', error);
            res.status(500).json({ error: 'No se pudo consultar la nómina.' });
        }
    });


    function idValido(id) {
        return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0 && Number(id) <= 2147483647;
    }
    async function ejecutarCalculo(req, res, guardar) {
        if (!idValido(req.params.id)) return res.status(400).json({ error: 'Identificador de nómina inválido.' });
        const id = Number(req.params.id);
        let cx;
        try {
            cx = await db.getConnection();
            await cx.beginTransaction();
            let nomina = await servicio.consultar(cx, id);
            if (guardar) {
                await cx.query('SELECT id_nomina FROM nomina WHERE id_nomina = ? OR (periodo_inicio <= ? AND periodo_fin >= ?) ORDER BY id_nomina FOR UPDATE',
                    [id, nomina.periodo_fin, nomina.periodo_inicio]);
                nomina = await servicio.consultar(cx, id, true);
            }
            let resultado;
            if (nomina.estado === 'Borrador') {
                resultado = guardar ? await servicio.guardar(cx, id, nomina) : await servicio.calcular(cx, id, nomina);
            } else {
                if (nomina.estado === 'Anulada') throw Object.assign(new Error('Esta nómina está anulada.'), { status: 409 });
                resultado = await servicio.guardado(cx, id, guardar);
                if (!resultado) throw Object.assign(new Error('Esta nómina tiene importes registrados, pero no tiene desglose guardado. Consulte el detalle registrado.'), { status: 409 });
            }
            await cx.commit();
            res.json(resultado);
        } catch (error) {
            if (cx) { try { await cx.rollback(); } catch (fallo) { console.error('Error al revertir nómina:', fallo); } }
            if (!error.status) console.error('Error al calcular nómina:', error);
            const status = error.status || (error.codigo === 'TASAS_NO_CONFIGURADAS' ? 422 : 500);
            res.status(status).json({ error: error.status || status === 422 ? error.message :
                error.code === 'ER_NO_SUCH_TABLE' ? 'Ejecute preparar-nomina-guardada.sql antes de guardar resultados.' : 'No se pudo calcular y guardar la nómina.' });
        } finally { if (cx) cx.release(); }
    }
    app.get('/api/nominas/:id/calculo-regular', (req, res) => ejecutarCalculo(req, res, false));
    app.post('/api/nominas/:id/calcular-guardar', (req, res) => ejecutarCalculo(req, res, true));
};
