document.addEventListener('DOMContentLoaded', async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id || !/^\d+$/.test(id)) return;
    const aviso = document.getElementById('avisoFechaPago');
    const boton = document.getElementById('corregirFechaPago');
    const mostrar = valor => valor.split('-').reverse().join('/');
    try {
        const respuesta = await fetch(`/api/nominas/${encodeURIComponent(id)}`);
        if (!respuesta.ok) return;
        const { nomina } = await respuesta.json();
        if (nomina.estado !== 'Borrador') return;
        const semana = fechasNomina.calcularSemana(String(nomina.periodo_inicio).slice(0, 10));
        if (semana.periodo_fin !== String(nomina.periodo_fin).slice(0, 10)) {
            throw new Error('Este borrador no abarca una semana de lunes a domingo. Revise su período.');
        }
        if (semana.fecha_pago === String(nomina.fecha_pago).slice(0, 10)) return;
        aviso.textContent = `La fecha de pago que corresponde a esta semana es ${mostrar(semana.fecha_pago)}.`;
        aviso.hidden = false;
        boton.textContent = `Corregir pago al ${mostrar(semana.fecha_pago)}`;
        boton.hidden = false;
        boton.addEventListener('click', async () => {
            boton.disabled = true;
            try {
                const respuesta = await fetch(`/api/nominas/${encodeURIComponent(id)}/fecha-pago`, { method: 'PATCH' });
                const datos = await respuesta.json();
                if (!respuesta.ok) throw new Error(datos.error || 'No se pudo corregir la fecha.');
                // Recargar el detalle para mostrar exactamente los datos guardados.
                window.location.reload();
            } catch (error) {
                aviso.textContent = error.message;
                boton.disabled = false;
            }
        });
    } catch (error) {
        aviso.textContent = error.message;
        aviso.hidden = false;
    }
});
