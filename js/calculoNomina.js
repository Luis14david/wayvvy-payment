const { elegir } = require('./tasasDescuentos');
const JORNADA_DIARIA = 480;
const JORNADA_SEMANAL = 2400;
const UMBRAL_RECARGO_100 = 4080;
function centavos(valor, permitirCero = false) {
    const texto = String(valor);
    if (!/^\d{1,12}(\.\d{1,2})?$/.test(texto)) throw new Error('Tarifa inválida en el historial.');
    const [entero, decimal = ''] = texto.split('.');
    const monto = BigInt(entero) * 100n + BigInt(decimal.padEnd(2, '0'));
    if (monto === 0n && !permitirCero) throw new Error('La tarifa debe ser mayor que cero.');
    return monto;
}

function importeTexto(monto) {
    return `${monto / 100n}.${String(monto % 100n).padStart(2, '0')}`;
}

function lunesDeSemana(fecha) {
    if (typeof fecha !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(fecha)) throw new Error('Fecha de asistencia inválida.');
    const dia = new Date(`${fecha}T00:00:00Z`);
    if (!Number.isFinite(dia.getTime()) || dia.toISOString().slice(0, 10) !== fecha) throw new Error('Fecha de asistencia inválida.');
    dia.setUTCDate(dia.getUTCDate() - (dia.getUTCDay() + 6) % 7);
    return dia.toISOString().slice(0, 10);
}

function calcularRegulares(registros, periodo) {
    if (periodo) {
        lunesDeSemana(periodo.inicio);
        lunesDeSemana(periodo.fin);
        if (periodo.fin < periodo.inicio) throw new Error('Período inválido.');
    }
    let total = 0n;
    const pendientes = [];
    const acumulados = new Map();
    const fechasVistas = new Set();
    const dias = [];
    // La tarifa histórica corresponde a la fecha trabajada.
    const ordenados = [...registros].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
    for (const registro of ordenados) {
        const { minutos_regulares: regulares, minutos_extras: extras } = registro;
        if (!Number.isInteger(regulares) || !Number.isInteger(extras) || regulares < 0 || extras < 0 || regulares + extras > 1440) {
            throw new Error(`Minutos inválidos: empleado ${registro.id_empleado}, fecha ${registro.fecha}.`);
        }
        const semana = lunesDeSemana(registro.fecha);
        const clave = `${registro.id_empleado}/${semana}`;
        const claveDia = `${registro.id_empleado}/${registro.fecha}`;
        if (fechasVistas.has(claveDia)) throw new Error('Asistencia duplicada para un empleado y fecha.');
        fechasVistas.add(claveDia);
        const anteriores = acumulados.get(clave) || { trabajados: 0, normales: 0 };
        const trabajados = regulares + extras;
        const normales = Math.min(regulares, JORNADA_DIARIA,
            Math.max(0, JORNADA_SEMANAL - anteriores.normales), Math.max(0, UMBRAL_RECARGO_100 - anteriores.trabajados));
        const excedentes = trabajados - normales;
        const extras35 = Math.min(excedentes, Math.max(0, UMBRAL_RECARGO_100 - anteriores.trabajados - normales));
        const extras100 = excedentes - extras35;
        acumulados.set(clave, { trabajados: anteriores.trabajados + trabajados, normales: anteriores.normales + normales });
        // Se cuenta la semana completa antes de filtrar un rango parcial.
        if (periodo && (registro.fecha < periodo.inicio || registro.fecha > periodo.fin)) continue;
        const faltaTarifa = registro.tarifa_hora == null;
        if (faltaTarifa) pendientes.push({ id_empleado: registro.id_empleado, fecha: registro.fecha });
        // Redondear una vez por día al centavo, sin operar con decimales binarios.
        const importe = faltaTarifa ? null : (BigInt(normales) * centavos(registro.tarifa_hora) + 30n) / 60n;
        const adicional = faltaTarifa ? null :
            ((BigInt(extras35) * 135n + BigInt(extras100) * 200n) * centavos(registro.tarifa_hora) + 3000n) / 6000n;
        if (importe !== null) total += importe;
        dias.push({ ...registro, semana_inicio: semana, minutos_normales: normales,
            minutos_extras_35: extras35, minutos_extras_100: extras100,
            minutos_excedentes: excedentes, importe_normal: importe === null ? null : importeTexto(importe),
            importe_excedente: adicional === null ? null : importeTexto(adicional) });
    }
    return {
        dias, pendientes, limite_semanal_minutos: JORNADA_SEMANAL,
        limite_diario_minutos: JORNADA_DIARIA, umbral_recargo_100_minutos: UMBRAL_RECARGO_100,
        recargo_extra_porcentaje: 35, recargo_extra_superior_porcentaje: 100,
        regla_horas: 'ordinaria_40_8_recargos_35_100_v1',
        total_normal: pendientes.length ? null : importeTexto(total),
        minutos_normales: dias.reduce((total, fila) => total + fila.minutos_normales, 0),
        minutos_excedentes: dias.reduce((total, fila) => total + fila.minutos_excedentes, 0),
        minutos_extras_35: dias.reduce((total, fila) => total + fila.minutos_extras_35, 0),
        minutos_extras_100: dias.reduce((total, fila) => total + fila.minutos_extras_100, 0),
        alcance: 'Vista previa por fecha trabajada.'
    };
}

// Resumen de nómina e incentivos separados según la configuración provisional del proyecto.
function resumirNomina(calculo, incentivos) {
    const empleados = new Map();
    function obtener(fila) {
        const clave = String(fila.id_empleado);
        if (!empleados.has(clave)) empleados.set(clave, {
            id_empleado: fila.id_empleado, numero_empleado: fila.numero_empleado,
            nombre: [fila.nombres, fila.apellidos].filter(Boolean).join(' ') || `Empleado ${clave}`,
            minutos_normales: 0, minutos_excedentes: 0, minutos_extras_35: 0, minutos_extras_100: 0,
            normal: 0n, excedente: 0n, incentivos: 0n, pendiente: false, tieneAsistencia: false
        });
        return empleados.get(clave);
    }
    for (const dia of calculo.dias) {
        const empleado = obtener(dia);
        empleado.tieneAsistencia = true;
        empleado.minutos_normales += dia.minutos_normales;
        empleado.minutos_excedentes += dia.minutos_excedentes;
        empleado.minutos_extras_35 += dia.minutos_extras_35;
        empleado.minutos_extras_100 += dia.minutos_extras_100;
        if (dia.importe_normal == null) empleado.pendiente = true;
        else empleado.normal += centavos(dia.importe_normal, true);
        if (dia.importe_excedente == null) empleado.pendiente = true;
        else empleado.excedente += centavos(dia.importe_excedente, true);
    }
    let totalIncentivos = 0n;
    let subtotal = 0n;
    const vistos = new Set();
    for (const incentivo of incentivos) {
        if (vistos.has(String(incentivo.id_detalle_concepto))) throw new Error('Incentivo duplicado en la consulta.');
        vistos.add(String(incentivo.id_detalle_concepto));
        const monto = centavos(incentivo.monto, true);
        obtener(incentivo).incentivos += monto;
        totalIncentivos += monto;
    }
    const filas = [...empleados.values()].sort((a, b) => Number(a.numero_empleado || a.id_empleado) - Number(b.numero_empleado || b.id_empleado));
    const resultado = filas.filter(empleado => empleado.tieneAsistencia).map(empleado => {
        subtotal += empleado.normal;
        return {
            id_empleado: empleado.id_empleado, nombre: empleado.nombre,
            minutos_normales: empleado.minutos_normales, minutos_excedentes: empleado.minutos_excedentes,
            minutos_extras_35: empleado.minutos_extras_35, minutos_extras_100: empleado.minutos_extras_100,
            importe_normal: empleado.pendiente ? null : importeTexto(empleado.normal),
            importe_excedente: empleado.pendiente ? null : importeTexto(empleado.excedente),
            bruto: empleado.pendiente ? null : importeTexto(empleado.normal + empleado.excedente)
        };
    });
    return { empleados: resultado,
        incentivos_aparte: filas.filter(empleado => empleado.incentivos > 0n).map(empleado => ({
            id_empleado: empleado.id_empleado, nombre: empleado.nombre, monto: importeTexto(empleado.incentivos)
        })),
        total_incentivos_aparte: importeTexto(totalIncentivos),
        subtotal_nomina: filas.some(empleado => empleado.pendiente) ? null : importeTexto(subtotal),
        tratamiento_incentivos: 'separados_provisionalmente' };
}



// Se usan centavos y se redondea cada descuento una sola vez por mes.
function descuentosMensuales(normal, excedente, mes, versiones) {
    const version = elegir(versiones || [], mes);
    const p = version.parametros;
    const salario = centavos(normal, true) + centavos(excedente, true);
    const retener = (tope, tasa) => ((salario < centavos(tope) ? salario : centavos(tope)) * centavos(tasa, true) + 5000n) / 10000n;
    const afp = retener(p.tope_afp, p.afp), sfs = retener(p.tope_sfs, p.sfs);
    const base = salario-afp-sfs, anual = base*12n;
    let impuesto = 0n;
    if (anual > centavos(p.limite2,true)) impuesto = centavos(p.cuota3,true)*10000n+(anual-centavos(p.limite2,true))*centavos(p.tasa3,true);
    else if (anual > centavos(p.limite1,true)) impuesto = centavos(p.cuota2,true)*10000n+(anual-centavos(p.limite1,true))*centavos(p.tasa2,true);
    else if (anual > centavos(p.exento,true)) impuesto = (anual-centavos(p.exento,true))*centavos(p.tasa1,true);
    const isr = (impuesto+60000n)/120000n;
    return {afp:importeTexto(afp),sfs:importeTexto(sfs),isr:importeTexto(isr),base_isr:importeTexto(base),total:importeTexto(afp+sfs+isr),
        tasa_aplicada:{id_tasa:version.id_tasa,vigente_desde:version.vigente_desde,parametros:{...p}}};
}

function mesAnterior(fecha) {
    const dia = new Date(`${fecha.slice(0, 7)}-01T00:00:00Z`);
    dia.setUTCMonth(dia.getUTCMonth() - 1);
    return dia.toISOString().slice(0, 7);
}

function finDeMes(mes) {
    const dia = new Date(`${mes}-01T00:00:00Z`);
    dia.setUTCMonth(dia.getUTCMonth() + 1);
    dia.setUTCDate(0);
    return dia.toISOString().slice(0, 10);
}

function fechaDescuento(mes) {
    const dia = new Date(`${mes}-01T00:00:00Z`);
    dia.setUTCMonth(dia.getUTCMonth() + 1);
    dia.setUTCDate(1 + (5 - dia.getUTCDay() + 7) % 7);
    return dia.toISOString().slice(0, 10);
}

function rangoDescuentos(nomina) {
    lunesDeSemana(nomina.fecha_pago);
    const anterior = mesAnterior(nomina.fecha_pago);
    const aplica = nomina.fecha_pago === fechaDescuento(anterior);
    return { inicio: `${anterior}-01`, fin: aplica ? [finDeMes(anterior), nomina.periodo_fin].sort().pop() : nomina.periodo_fin,
        mes_descuento: aplica ? anterior : null };
}

// Los acumulados son estimaciones; consultar nunca registra una retención.
function resumirDescuentos(registros, nomina, resumen, versiones) {
    const rango = rangoDescuentos(nomina);
    const meses = new Set([nomina.periodo_inicio.slice(0, 7), nomina.periodo_fin.slice(0, 7)]);
    if (rango.mes_descuento) meses.add(rango.mes_descuento);
    const acumulados = [];
    for (const mes of [...meses].sort()) {
        const fin = mes === rango.mes_descuento ? finDeMes(mes) :
            [finDeMes(mes), nomina.periodo_fin].sort()[0];
        const calculo = calcularRegulares(registros, { inicio: `${mes}-01`, fin });
        const mensual = resumirNomina(calculo, []);
        for (const empleado of mensual.empleados) {
            const descuentos = empleado.bruto == null ?
                { afp: null, sfs: null, isr: null, total: null, base_isr: null } :
                descuentosMensuales(empleado.importe_normal, empleado.importe_excedente, mes, versiones);
            acumulados.push({ ...empleado, mes, hasta: fin, fecha_descuento: fechaDescuento(mes), ...descuentos });
        }
    }
    const aDescontar = new Map(acumulados.filter(fila => fila.mes === rango.mes_descuento)
        .map(fila => [String(fila.id_empleado), fila]));
    const empleados = new Map(resumen.empleados.map(fila => [String(fila.id_empleado), fila]));
    for (const [id, fila] of aDescontar) {
        if (!empleados.has(id)) empleados.set(id, { id_empleado: fila.id_empleado, nombre: fila.nombre,
            minutos_normales: 0, minutos_excedentes: 0, importe_normal: '0.00', importe_excedente: '0.00', bruto: '0.00' });
    }
    const pagos = [...empleados].map(([id, empleado]) => {
        const descuento = aDescontar.get(id) || { afp: '0.00', sfs: '0.00', isr: '0.00', total: '0.00' };
        const pendiente = empleado.bruto == null || descuento.total == null;
        const diferencia = pendiente ? null : centavos(empleado.bruto, true) - centavos(descuento.total, true);
        return { ...empleado, afp: descuento.afp, sfs: descuento.sfs, isr: descuento.isr,
            deducciones: descuento.total,
            neto: diferencia === null || diferencia < 0n ? null : importeTexto(diferencia),
            sueldo_insuficiente: diferencia !== null && diferencia < 0n };
    });
    return { acumulados, pagos, mes_descuento: rango.mes_descuento, vista_previa: true };
}

module.exports = { calcularRegulares, resumirNomina, descuentosMensuales, rangoDescuentos, resumirDescuentos };

// Cada mes usa solamente los ingresos dentro del rango consultado.
function calcularReporte(registros, inicio, fin, versiones) {
    const detalle = calcularRegulares(registros, {inicio, fin});
    if (detalle.pendientes.length) throw new Error('Falta una tarifa histórica para el período.');
    const resumen = resumirNomina(detalle, []).empleados[0];
    const descuentos = {afp:0n, sfs:0n, isr:0n};
    const meses = [];
    for (let mes = inicio.slice(0,7); mes <= fin.slice(0,7);) {
        const desde = [mes+'-01', inicio].sort().pop();
        const hasta = [finDeMes(mes), fin].sort()[0];
        const dias = calcularRegulares(registros, {inicio:desde, fin:hasta});
        const fila = resumirNomina(dias, []).empleados[0];
        const descuento = descuentosMensuales(
            fila?.importe_normal || '0.00', fila?.importe_excedente || '0.00', mes, versiones);
        for (const clave of Object.keys(descuentos))
            descuentos[clave] += centavos(descuento[clave], true);
        meses.push({mes, desde, hasta, ...descuento});
        const siguiente = new Date(mes+'-01T00:00:00Z');
        siguiente.setUTCMonth(siguiente.getUTCMonth()+1);
        mes = siguiente.toISOString().slice(0,7);
    }
    const total = descuentos.afp + descuentos.sfs + descuentos.isr;
    const bruto = resumen?.bruto || '0.00';
    return {minutos_normales:detalle.minutos_normales, minutos_excedentes:detalle.minutos_excedentes,
        importe_normal:resumen?.importe_normal || '0.00', importe_excedente:resumen?.importe_excedente || '0.00', bruto,
        ...Object.fromEntries(Object.entries(descuentos).map(([k,v])=>[k,importeTexto(v)])),
        deducciones:importeTexto(total), neto:importeTexto(centavos(bruto,true)-total), meses};
}
module.exports.calcularReporte = calcularReporte;
