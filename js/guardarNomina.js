const { cargar: cargarTasas } = require('./tasasDescuentos');
const { calcularRegulares, resumirNomina, rangoDescuentos, resumirDescuentos } = require('./calculoNomina');
const { calcularSemana } = require('./fechasNomina');

const rechazar = (status, mensaje) => { throw Object.assign(new Error(mensaje), { status }); };
function centavos(valor) {
    if (!/^\d{1,12}\.\d{2}$/.test(String(valor))) rechazar(422, 'Hay importes pendientes o inválidos. Revise las tarifas y las tasas.');
    const [entero, decimal] = String(valor).split('.');
    return BigInt(entero) * 100n + BigInt(decimal);
}
function importe(valor) {
    const negativo = valor < 0n;
    const absoluto = negativo ? -valor : valor;
    if (absoluto > 99999999999999n) rechazar(422, 'El importe supera la capacidad del campo de nómina.');
    return `${negativo ? '-' : ''}${absoluto / 100n}.${String(absoluto % 100n).padStart(2, '0')}`;
}
async function guardado(db, id, bloquear = false) {
    const [filas] = await db.query(`SELECT resultado, fecha_calculo FROM nomina_calculo_guardado WHERE id_nomina = ?${bloquear ? ' FOR UPDATE' : ''}`, [id]);
    if (!filas.length) return null;
    return { ...JSON.parse(filas[0].resultado), guardado: true, fecha_calculo: filas[0].fecha_calculo };
}
async function calcular(db, id, nomina) {
    const semana = calcularSemana(nomina.periodo_inicio);
    if (nomina.periodo_fin !== semana.periodo_fin || nomina.fecha_pago !== semana.fecha_pago) {
        rechazar(409, 'Revise el período y la fecha de pago antes de calcular.');
    }
    const rango = rangoDescuentos(nomina);
    const [registros] = await db.query(`SELECT a.id_empleado, e.numero_empleado, e.nombres, e.apellidos,
            DATE_FORMAT(a.fecha, '%Y-%m-%d') AS fecha, a.minutos_regulares, a.minutos_extras,
            h.salario AS tarifa_hora, DATE_FORMAT(h.fecha_inicio, '%Y-%m-%d') AS tarifa_desde
        FROM asistencia a INNER JOIN empleados e ON e.id_empleado = a.id_empleado
        LEFT JOIN historial_salario h ON h.id_historial = (
            SELECT h2.id_historial FROM historial_salario h2
            WHERE h2.id_empleado = a.id_empleado AND h2.fecha_inicio <= a.fecha
            ORDER BY h2.fecha_inicio DESC, h2.id_historial DESC LIMIT 1)
        WHERE a.fecha BETWEEN DATE_SUB(?, INTERVAL WEEKDAY(?) DAY)
            AND DATE_ADD(?, INTERVAL (6 - WEEKDAY(?)) DAY)
          AND (a.minutos_regulares > 0 OR a.minutos_extras > 0
               OR a.minutos_regulares IS NULL OR a.minutos_extras IS NULL)
        ORDER BY e.numero_empleado, a.fecha`, [rango.inicio, rango.inicio, rango.fin, rango.fin]);
    const [incentivos] = await db.query(`SELECT i.id_incentivo AS id_detalle_concepto, i.monto,
            i.id_empleado, e.numero_empleado, e.nombres, e.apellidos
        FROM incentivos i INNER JOIN empleados e ON e.id_empleado = i.id_empleado
        WHERE i.id_nomina = ? ORDER BY i.id_incentivo`, [id]);
    const horas = calcularRegulares(registros, { inicio: nomina.periodo_inicio, fin: nomina.periodo_fin });
    const resumen = resumirNomina(horas, incentivos);
    const descuentos = resumirDescuentos(registros, nomina, resumen, await cargarTasas(db));
    return { id_nomina: id, ...horas, ...resumen, ...descuentos, guardado: false,
        alcance: 'Cálculo por horas; los incentivos se presentan por separado.' };
}
async function consultar(db, id, bloquear = false) {
    const [filas] = await db.query(`SELECT estado, DATE_FORMAT(periodo_inicio, '%Y-%m-%d') periodo_inicio,
        DATE_FORMAT(periodo_fin, '%Y-%m-%d') periodo_fin, DATE_FORMAT(fecha_pago, '%Y-%m-%d') fecha_pago
        FROM nomina WHERE id_nomina = ?${bloquear ? ' FOR UPDATE' : ''}`, [id]);
    if (!filas.length) rechazar(404, 'La nómina no existe.');
    return filas[0];
}
async function guardar(db, id, nomina) {
    const [otras] = await db.query(`SELECT id_nomina FROM nomina
        WHERE id_nomina <> ? AND estado IN ('Procesada', 'Pagada')
        AND periodo_inicio <= ? AND periodo_fin >= ? LIMIT 1 FOR UPDATE`, [id, nomina.periodo_fin, nomina.periodo_inicio]);
    if (otras.length) rechazar(409, 'Ya hay una nómina calculada o pagada para un período que se superpone.');
    const resultado = await calcular(db, id, nomina);
    if (resultado.pendientes.length || resultado.acumulados.some(f => f.total == null)) {
        rechazar(422, 'Faltan tarifas o tasas. Complete esos datos antes de guardar.');
    }
    const empleados = new Map(resultado.pagos.map(p => [String(p.id_empleado), { ...p }]));
    for (const incentivo of resultado.incentivos_aparte) {
        if (!empleados.has(String(incentivo.id_empleado))) empleados.set(String(incentivo.id_empleado), {
            id_empleado: incentivo.id_empleado, nombre: incentivo.nombre, bruto: '0.00',
            importe_normal: '0.00', importe_excedente: '0.00', minutos_normales: 0, minutos_excedentes: 0,
            afp: '0.00', sfs: '0.00', isr: '0.00', deducciones: '0.00', neto: '0.00', sueldo_insuficiente: false
        });
    }
    if (!empleados.size) rechazar(422, 'No hay horas, incentivos ni deducciones para guardar en este período.');
    let bruto = 0n, deducciones = 0n, neto = 0n;
    for (const pago of empleados.values()) {
        const ingreso = centavos(pago.bruto), descuento = centavos(pago.deducciones);
        const saldo = ingreso - descuento;
        pago.saldo_pendiente = saldo < 0n ? importe(-saldo) : '0.00';
        pago.neto_registrado = importe(saldo);
        bruto += ingreso; deducciones += descuento; neto += saldo;
        const [existentes] = await db.query('SELECT id_detalle FROM detalle_nomina WHERE id_nomina = ? AND id_empleado = ? FOR UPDATE', [id, pago.id_empleado]);
        if (existentes.length > 1) rechazar(409, 'Hay detalles duplicados para un empleado. Revise los registros antes de guardar.');
        const valores = [pago.bruto, pago.bruto, pago.deducciones, importe(saldo)];
        if (existentes.length) {
            await db.query(`UPDATE detalle_nomina SET salario_bruto = ?, total_ingresos = ?,
                total_deducciones = ?, salario_neto = ? WHERE id_detalle = ?`, [...valores, existentes[0].id_detalle]);
        } else {
            await db.query(`INSERT INTO detalle_nomina (salario_bruto, total_ingresos, total_deducciones,
                salario_neto, id_nomina, id_empleado) VALUES (?, ?, ?, ?, ?, ?)`, [...valores, id, pago.id_empleado]);
        }
    }
    resultado.pagos = [...empleados.values()];
    resultado.guardado = true; resultado.vista_previa = false;
    resultado.totales_guardados = { bruto: importe(bruto), deducciones: importe(deducciones), neto: importe(neto) };
    resultado.alcance = 'Resultados guardados; los incentivos se presentan por separado.';
    await db.query('INSERT INTO nomina_calculo_guardado (id_nomina, resultado) VALUES (?, ?)', [id, JSON.stringify(resultado)]);
    await db.query(`UPDATE nomina SET total_bruto = ?, total_deducciones = ?, total_neto = ?, estado = 'Procesada'
        WHERE id_nomina = ?`, [importe(bruto), importe(deducciones), importe(neto), id]);
    return resultado;
}
module.exports = { consultar, calcular, guardar, guardado };
