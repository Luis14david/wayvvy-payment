// Fechas y montos utilizados por el historial de tarifas por hora.
const FECHA_INICIAL = '2026-08-25';

function validarFecha(fecha) {
    if (typeof fecha !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(fecha)) return false;
    const valor = new Date(`${fecha}T00:00:00Z`);
    return Number.isFinite(valor.getTime()) && valor.toISOString().slice(0, 10) === fecha;
}

function validarMonto(valor) {
    if (!['string', 'number'].includes(typeof valor) || !/^\d{1,8}(\.\d{1,2})?$/.test(String(valor))) {
        throw new Error('La tarifa debe tener como máximo dos decimales.');
    }
    const numero = Number(valor);
    if (numero <= 0 || numero > 99999999.99) throw new Error('La tarifa por hora debe ser mayor que cero.');
    return numero.toFixed(2);
}

function fechaInicioPermitida(ingreso) {
    if (!validarFecha(ingreso)) throw new Error('La fecha de ingreso no es válida.');
    return ingreso > FECHA_INICIAL ? ingreso : FECHA_INICIAL;
}

function validarCambio({ monto, fecha, motivo, ingreso, ultimaFecha }) {
    const tarifa = validarMonto(monto);
    if (!validarFecha(fecha) || fecha < fechaInicioPermitida(ingreso)) {
        throw new Error('La tarifa no puede comenzar antes del ingreso ni antes del 25 de agosto de 2026.');
    }
    if (ultimaFecha && fecha <= ultimaFecha) {
        throw new Error('La nueva vigencia debe ser posterior a la última tarifa registrada.');
    }
    if (typeof motivo !== 'string' || !motivo.trim() || motivo.trim().length > 255) {
        throw new Error('Indique un motivo de entre 1 y 255 caracteres.');
    }
    return { tarifa, fecha, motivo: motivo.trim() };
}

// Devuelve null cuando no hay una tarifa confirmada para la fecha consultada.
function tarifaEnFecha(historial, fecha) {
    if (!validarFecha(fecha)) throw new Error('Fecha de consulta inválida.');
    return historial.filter(fila => fila.fecha_inicio <= fecha)
        .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))[0] || null;
}

module.exports = { FECHA_INICIAL, validarFecha, validarMonto, fechaInicioPermitida, validarCambio, tarifaEnFecha };
