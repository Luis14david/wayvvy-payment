document.addEventListener('DOMContentLoaded', async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || !/^\d+$/.test(id) || Number(id) < 1) return;
    const panel = document.getElementById('panelCalculoRegular');
    const boton = document.getElementById('btnCalculoRegular');
    const mensaje = document.getElementById('mensajeCalculoRegular');
    const cuerpo = document.getElementById('calculoRegularBody');
    const total = document.getElementById('totalCalculoRegular');
    const panelIncentivos = document.getElementById('incentivosAparte');
    const cuerpoIncentivos = document.getElementById('incentivosAparteBody');
    const totalIncentivos = document.getElementById('totalIncentivosAparte');
    const panelDescuentos = document.getElementById('panelDescuentos');
    const descuentosBody = document.getElementById('descuentosBody');
    const acumuladosBody = document.getElementById('acumuladosBody');
    const agregarFila = (tabla, valores) => {
        const fila = document.createElement('tr');
        for (const valor of valores) {
            const celda = document.createElement('td');
            celda.textContent = valor;
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    };
    const tiempo = minutos => `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')} min`;
    const formatoImporte = new Intl.NumberFormat('en-US', {
        useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    const moneda = valor => {
        if (valor === null || valor === undefined) return 'Pendiente';
        const numero = Number(valor);
        return Number.isFinite(numero) ? formatoImporte.format(numero) : '—';
    };
    try {
        const respuesta = await fetch(`/api/nominas/${encodeURIComponent(id)}`);
        if (!respuesta.ok) return;
        const datos = await respuesta.json();
        panel.hidden = datos.nomina.estado !== 'Borrador';
    } catch { return; }

    boton.addEventListener('click', async () => {
        boton.disabled = true;
        cuerpo.replaceChildren();
        total.textContent = '';
        panelIncentivos.hidden = true;
        cuerpoIncentivos.replaceChildren();
        totalIncentivos.textContent = '';
        panelDescuentos.hidden = true;
        descuentosBody.replaceChildren();
        acumuladosBody.replaceChildren();
        mensaje.textContent = 'Calculando...';
        try {
            const respuesta = await fetch(`/api/nominas/${encodeURIComponent(id)}/calculo-regular`);
            let datos;
            try { datos = await respuesta.json(); } catch { throw new Error('El servidor no devolvió un cálculo válido.'); }
            if (!respuesta.ok) throw new Error(datos.error || 'No se pudo consultar el cálculo.');
            if (datos.limite_semanal_minutos !== 2400) throw new Error('Falta actualizar el servidor con la clasificación de 40 horas semanales.');
            if (!Array.isArray(datos.empleados)) throw new Error('Falta actualizar el servidor con el resumen de incentivos.');
            if (datos.tratamiento_incentivos !== 'separados_provisionalmente') throw new Error('Falta actualizar el servidor para separar los incentivos.');
            if (!Array.isArray(datos.pagos) || !Array.isArray(datos.acumulados)) throw new Error('Actualice el servidor de nómina.');
            for (const empleado of datos.empleados) {
                const fila = document.createElement('tr');
                const importe = empleado.importe_normal == null ? 'Pendiente: falta tarifa' : moneda(empleado.importe_normal);
                const valores = [empleado.nombre, tiempo(empleado.minutos_normales), tiempo(empleado.minutos_excedentes),
                    importe, moneda(empleado.importe_excedente), moneda(empleado.bruto)];
                for (const valor of valores) {
                    const celda = document.createElement('td');
                    celda.textContent = valor;
                    fila.appendChild(celda);
                }
                cuerpo.appendChild(fila);
            }
            for (const incentivo of datos.incentivos_aparte) {
                const fila = document.createElement('tr');
                for (const valor of [incentivo.nombre, moneda(incentivo.monto)]) {
                    const celda = document.createElement('td');
                    celda.textContent = valor;
                    fila.appendChild(celda);
                }
                cuerpoIncentivos.appendChild(fila);
            }
            for (const pago of datos.pagos) {
                agregarFila(descuentosBody, [pago.nombre, moneda(pago.afp), moneda(pago.sfs),
                    moneda(pago.isr), moneda(pago.deducciones), pago.sueldo_insuficiente ? 'Saldo insuficiente' : moneda(pago.neto)]);
            }
            for (const acumulado of datos.acumulados) {
                const [anio, mes] = acumulado.mes.split('-');
                const [a, m, d] = acumulado.fecha_descuento.split('-');
                agregarFila(acumuladosBody, [mes + '/' + anio, acumulado.nombre, moneda(acumulado.bruto),
                    moneda(acumulado.afp), moneda(acumulado.sfs), moneda(acumulado.isr), moneda(acumulado.total), d + '/' + m + '/' + a]);
            }
            panelDescuentos.hidden = false;
            panelIncentivos.hidden = false;
            totalIncentivos.textContent = datos.incentivos_aparte.length ?
                `Total de incentivos: RD$ ${moneda(datos.total_incentivos_aparte)}` : 'Sin incentivos registrados.';
            mensaje.textContent = !datos.empleados.length ? 'No hay horas registradas en este período.' :
                (datos.pendientes.length || datos.acumulados.some(fila => fila.total == null)) ? 'Faltan tarifas por registrar.' :
                '';
            total.textContent = datos.empleados.length ? `Total normal: ${datos.subtotal_nomina == null ? 'Pendiente' : `RD$ ${moneda(datos.subtotal_nomina)}`}` : '';
        } catch (error) { mensaje.textContent = error.message; }
        finally { boton.disabled = false; }
    });
});
