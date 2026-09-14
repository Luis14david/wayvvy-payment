document.addEventListener('DOMContentLoaded', function () {
    const nominasBody = document.getElementById('nominasBody');
    const formulario = document.getElementById('nuevaNominaForm');
    const dialogo = document.getElementById('nuevaNominaDialog');
    const mensaje = document.getElementById('mensajeNuevaNomina');
    const guardar = document.getElementById('guardarNuevaNomina');
    let guardando = false;
    const inicio = document.getElementById('periodoInicioNomina');
    const fin = document.getElementById('periodoFinNomina');
    const pago = document.getElementById('fechaPagoNomina');

    function actualizarFechas() {
        inicio.setCustomValidity('');
        fin.value = '';
        pago.value = '';
        try {
            const semana = fechasNomina.calcularSemana(inicio.value);
            fin.value = semana.periodo_fin;
            pago.value = semana.fecha_pago;
            mensaje.textContent = '';
            return true;
        } catch (error) {
            if (inicio.value) {
                inicio.setCustomValidity(error.message);
                mensaje.textContent = error.message;
            } else mensaje.textContent = '';
            return false;
        }
    }

    function formatearFecha(valor) {
        if (!valor) return '—';
        const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
        return `${mes}/${dia}/${anio}`;
    }

    function mostrarMensaje(texto) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 6;
        celda.textContent = texto;
        fila.appendChild(celda);
        nominasBody.replaceChildren(fila);
    }

    async function cargarNominas() {
        mostrarMensaje('Cargando nóminas...');
        try {
            const respuesta = await fetch('/api/nominas');
            if (!respuesta.ok) throw new Error('No se pudieron cargar las nóminas.');
            const nominas = await respuesta.json();
            if (!Array.isArray(nominas)) throw new Error('La respuesta del servidor no es válida.');
            if (!nominas.length) return mostrarMensaje('No hay nóminas registradas.');
            nominasBody.replaceChildren();
            nominas.forEach(function (nomina) {
                const fila = document.createElement('tr');
                const inicio = formatearFecha(nomina.periodo_inicio);
                const fin = formatearFecha(nomina.periodo_fin);
                [nomina.id_nomina, `${inicio} - ${fin}`, inicio, fin, nomina.estado].forEach(function (valor) {
                    const celda = document.createElement('td');
                    celda.textContent = valor;
                    fila.appendChild(celda);
                });
                const acciones = document.createElement('td');
                const ver = document.createElement('a');
                ver.className = 'btn-ver-nomina';
                ver.textContent = 'Ver';
                ver.href = `/html/verNomina.html?id=${encodeURIComponent(nomina.id_nomina)}`;
                acciones.appendChild(ver);
                fila.appendChild(acciones);
                nominasBody.appendChild(fila);
            });
        } catch (error) {
            mostrarMensaje(error.message);
        }
    }

    document.getElementById('btnNuevaNomina').addEventListener('click', function () {
        formulario.reset();
        mensaje.textContent = '';
        inicio.setCustomValidity('');
        dialogo.showModal();
    });
    document.getElementById('cancelarNuevaNomina').addEventListener('click', function () {
        if (!guardando) dialogo.close();
    });
    dialogo.addEventListener('cancel', function (event) {
        if (guardando) event.preventDefault();
    });
    inicio.addEventListener('input', actualizarFechas);
    inicio.addEventListener('change', actualizarFechas);
    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (guardando) return;
        const fechasValidas = actualizarFechas();
        if (!formulario.reportValidity() || !fechasValidas) return;
        guardando = true;
        guardar.disabled = true;
        mensaje.textContent = 'Guardando...';
        try {
            const respuesta = await fetch('/api/nominas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(formulario)))
            });
            const datos = await respuesta.json();
            if (!respuesta.ok) throw new Error(datos.error || 'No se pudo crear la nómina.');
            mensaje.textContent = 'Nómina creada.';
            window.location.href = `/html/verNomina.html?id=${encodeURIComponent(datos.id_nomina)}`;
        } catch (error) {
            mensaje.textContent = error.message;
            guardando = false;
            guardar.disabled = false;
        }
    });
    cargarNominas();
});
