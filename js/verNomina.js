document.addEventListener('DOMContentLoaded', async function () {
    const mensaje = document.getElementById('mensajeDetalleNomina');
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
        mensaje.textContent = 'El identificador de nómina no es válido.';
        return;
    }
    function fecha(valor) {
        if (!valor) return '—';
        const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
        return `${mes}/${dia}/${anio}`;
    }
    function importe(valor) {
        if (valor === null || valor === undefined) return 'Sin calcular';
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero.toLocaleString('en-US', {
            useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2
        }) : '—';
    }
    try {
        const respuesta = await fetch(`/api/nominas/${encodeURIComponent(id)}`);
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.error || 'No se pudo cargar la nómina.');
        const n = datos.nomina;
        const campos = {
            numeroNomina: n.id_nomina, periodoNomina: `${fecha(n.periodo_inicio)} - ${fecha(n.periodo_fin)}`,
            pagoNomina: fecha(n.fecha_pago), estadoNomina: n.estado, anioNomina: n.anio,
            brutoNomina: importe(n.total_bruto), deduccionesNomina: importe(n.total_deducciones),
            netoNomina: importe(n.total_neto)
        };
        Object.entries(campos).forEach(([nombre, valor]) => {
            document.getElementById(nombre).textContent = valor ?? '—';
        });
        const cuerpo = document.getElementById('detalleNominaBody');
        datos.detalles.forEach(function (detalle) {
            const fila = document.createElement('tr');
            const nombre = [detalle.nombres, detalle.apellidos].filter(Boolean).join(' ') || `Empleado ${detalle.id_empleado}`;
            [nombre, importe(detalle.salario_bruto), importe(detalle.total_ingresos),
                importe(detalle.total_deducciones), importe(detalle.salario_neto)].forEach(function (valor) {
                const celda = document.createElement('td');
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            cuerpo.appendChild(fila);
        });
        if (!datos.detalles.length) {
            const fila = document.createElement('tr');
            const celda = document.createElement('td');
            celda.colSpan = 5;
            celda.textContent = 'Esta nómina todavía no tiene empleados registrados en su detalle.';
            fila.appendChild(celda);
            cuerpo.appendChild(fila);
        }
        mensaje.textContent = '';
        document.getElementById('contenidoDetalleNomina').hidden = false;
    } catch (error) {
        mensaje.textContent = error.message;
    }
});
