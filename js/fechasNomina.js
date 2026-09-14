// La semana trabajada va de lunes a domingo y se paga el viernes siguiente.
(function (raiz) {
    function calcularSemana(inicio) {
        if (typeof inicio !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(inicio)) {
            throw new Error('Seleccione una fecha de inicio válida.');
        }
        const lunes = new Date(`${inicio}T00:00:00Z`);
        if (!Number.isFinite(lunes.getTime()) || lunes.toISOString().slice(0, 10) !== inicio) {
            throw new Error('Seleccione una fecha de inicio válida.');
        }
        if (lunes.getUTCDay() !== 1) throw new Error('La semana de nómina debe comenzar un lunes.');
        const domingo = new Date(lunes.getTime() + 6 * 86400000);
        const viernes = new Date(lunes.getTime() + 11 * 86400000);
        if (viernes.getUTCFullYear() > 9999) throw new Error('La fecha de pago excede el año permitido.');
        return { periodo_inicio: inicio, periodo_fin: domingo.toISOString().slice(0, 10),
            fecha_pago: viernes.toISOString().slice(0, 10) };
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = { calcularSemana };
    else raiz.fechasNomina = { calcularSemana };
})(typeof window !== 'undefined' ? window : globalThis);
