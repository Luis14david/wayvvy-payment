// Clasificación de las primeras 40 horas semanales como tiempo normal.
// El excedente se paga a la tarifa vigente del día, sin recargo.
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
    // La tarifa se aplica al día trabajado, incluso cuando ese día cruza las 40 horas.
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
        const anteriores = acumulados.get(clave) || 0;
        const trabajados = regulares + extras;
        const normales = Math.min(trabajados, Math.max(0, 2400 - anteriores));
        const excedentes = trabajados - normales;
        acumulados.set(clave, anteriores + trabajados);
        // Se cuenta la semana completa antes de filtrar un rango parcial.
        if (periodo && (registro.fecha < periodo.inicio || registro.fecha > periodo.fin)) continue;
        const faltaTarifa = registro.tarifa_hora == null;
        if (faltaTarifa) pendientes.push({ id_empleado: registro.id_empleado, fecha: registro.fecha });
        // Redondear una vez por día al centavo, sin operar con decimales binarios.
        const importe = faltaTarifa ? null : (BigInt(normales) * centavos(registro.tarifa_hora) + 30n) / 60n;
        const adicional = faltaTarifa ? null : (BigInt(excedentes) * centavos(registro.tarifa_hora) + 30n) / 60n;
        if (importe !== null) total += importe;
        dias.push({ ...registro, semana_inicio: semana, minutos_normales: normales,
            minutos_excedentes: excedentes, importe_normal: importe === null ? null : importeTexto(importe),
            importe_excedente: adicional === null ? null : importeTexto(adicional) });
    }
    return {
        dias, pendientes, limite_semanal_minutos: 2400,
        total_normal: pendientes.length ? null : importeTexto(total),
        minutos_normales: dias.reduce((total, fila) => total + fila.minutos_normales, 0),
        minutos_excedentes: dias.reduce((total, fila) => total + fila.minutos_excedentes, 0),
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
            minutos_normales: 0, minutos_excedentes: 0, normal: 0n, excedente: 0n, incentivos: 0n, pendiente: false, tieneAsistencia: false
        });
        return empleados.get(clave);
    }
    for (const dia of calculo.dias) {
        const empleado = obtener(dia);
        empleado.tieneAsistencia = true;
        empleado.minutos_normales += dia.minutos_normales;
        empleado.minutos_excedentes += dia.minutos_excedentes;
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
function descuentosMensuales(normal, excedente, mes) {
    if (!/^2026-(0[2-9]|1[0-2])$/.test(mes)) {
        const error = new Error('Falta configurar las tasas y los topes para el mes ' + mes + '.');
        error.codigo = 'TASAS_NO_CONFIGURADAS';
        throw error;
    }
    // Base configurada del proyecto: tiempo normal y excedente semanal.
    const salario = centavos(normal, true) + centavos(excedente, true);
    const afp = ((salario < 46446000n ? salario : 46446000n) * 287n + 5000n) / 10000n;
    const sfs = ((salario < 23223000n ? salario : 23223000n) * 304n + 5000n) / 10000n;
    const base = salario - afp - sfs;
    const anual = base * 12n;
    let impuesto = 0n;
    // Cuota fija anual y porcentaje sobre el excedente de cada tramo.
    if (anual > 86712300n) impuesto = 7977600n * 100n + (anual - 86712300n) * 25n;
    else if (anual > 62432900n) impuesto = 3121600n * 100n + (anual - 62432900n) * 20n;
    else if (anual > 41622000n) impuesto = (anual - 41622000n) * 15n;
    const isr = (impuesto + 600n) / 1200n;
    return { afp: importeTexto(afp), sfs: importeTexto(sfs), isr: importeTexto(isr),
        base_isr: importeTexto(base), total: importeTexto(afp + sfs + isr) };
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
function resumirDescuentos(registros, nomina, resumen) {
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
                descuentosMensuales(empleado.importe_normal, empleado.importe_excedente, mes);
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

// Diferencia entre acumulados mensuales: los rangos parciales no reinician la escala.
function calcularReporte(registros, inicio, fin) {
    const detalle = calcularRegulares(registros, {inicio, fin});
    if (detalle.pendientes.length) throw new Error('Falta una tarifa histórica para el período.');
    const resumen = resumirNomina(detalle, []).empleados[0];
    const descuentos = {afp:0n, sfs:0n, isr:0n};
    const meses = [];
    for (let mes = inicio.slice(0,7); mes <= fin.slice(0,7);) {
        const desde = mes+'-01';
        const hasta = [finDeMes(mes),fin].sort()[0];
        const anterior = new Date(inicio+'T00:00:00Z');
        anterior.setUTCDate(anterior.getUTCDate()-1);
        const corte = anterior.toISOString().slice(0,10);
        function acumulado(hasta) {
            if (hasta < desde) return descuentosMensuales('0.00','0.00',mes);
            const dias = calcularRegulares(registros,{inicio:desde,fin:hasta});
            if (dias.pendientes.length) throw new Error('Falta una tarifa histórica para el acumulado mensual.');
            const fila = resumirNomina(dias,[]).empleados[0];
            return descuentosMensuales(fila?.importe_normal || '0.00',fila?.importe_excedente || '0.00',mes);
        }
        const cierre = acumulado(hasta);
        const previo = acumulado(mes === inicio.slice(0,7) ? corte : '0000-01-01');
        for (const clave of Object.keys(descuentos)) descuentos[clave] += centavos(cierre[clave],true)-centavos(previo[clave],true);
        meses.push({mes,hasta,...cierre});
        const siguiente = new Date(desde+'T00:00:00Z');
        siguiente.setUTCMonth(siguiente.getUTCMonth()+1);
        mes = siguiente.toISOString().slice(0,7);
    }
    const total = descuentos.afp+descuentos.sfs+descuentos.isr;
    const bruto = resumen?.bruto || '0.00';
    return {minutos_normales:detalle.minutos_normales,minutos_excedentes:detalle.minutos_excedentes,
        importe_normal:resumen?.importe_normal || '0.00',importe_excedente:resumen?.importe_excedente || '0.00',bruto,
        ...Object.fromEntries(Object.entries(descuentos).map(([k,v])=>[k,importeTexto(v)])),
        deducciones:importeTexto(total),neto:Number(bruto)-Number(importeTexto(total)),meses};
}
module.exports.calcularReporte = calcularReporte;
