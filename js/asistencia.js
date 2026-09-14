document.addEventListener('DOMContentLoaded', function () {
    const selectEmpleado = document.getElementById('empleadoAsistencia');
    const inputDesde = document.getElementById('semanaAsistencia');
    const inputHasta = document.getElementById('fechaHastaAsistencia');
    const asistenciaBody = document.getElementById('asistenciaBody');
    const rangoSemana = document.getElementById('rangoSemana');
    const btnGuardarHoras = document.getElementById('btnGuardarHoras');
    const controles = [selectEmpleado, inputDesde, inputHasta,
        document.getElementById('btnCalendarioDesde'), document.getElementById('btnCalendarioHasta')];
    let cargado = false;
    let ocupado = false;
    let modificado = false;
    let seleccion = [];

    // ============================
    // BOTONES DEL CALENDARIO
    // ============================
    controles.slice(3).forEach((boton, indice) => {
        boton.addEventListener('click', () => {
            const campo = [inputDesde, inputHasta][indice];
            if (campo.showPicker) campo.showPicker();
            else campo.focus();
        });
    });

    function actualizarControles() {
        controles.forEach(campo => { campo.disabled = ocupado; });
        btnGuardarHoras.disabled = ocupado || !cargado;
        asistenciaBody.querySelectorAll('input').forEach(campo => {
            campo.disabled = ocupado || !cargado || campo.closest('tr').dataset.domingo === 'true';
        });
    }

    async function leerRespuesta(response) {
        let datos;
        try { datos = await response.json(); } catch {
            throw new Error('El servidor no devolvió una respuesta válida.');
        }
        if (!response.ok) throw new Error(datos.error || 'No se pudo completar la operación.');
        return datos;
    }

    // ============================
    // FORMATO DE FECHAS Y TIEMPO
    // ============================
    function fechaParaInput(fecha) {
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    }

    function fechaUTC(texto) {
        if (!/^[1-9]\d{3}-\d{2}-\d{2}$/.test(texto)) return null;
        const fecha = new Date(`${texto}T00:00:00Z`);
        return Number.isFinite(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto ? fecha : null;
    }

    function formatearFechaUSA(fecha) {
        return `${fecha.slice(5, 7)}/${fecha.slice(8, 10)}/${fecha.slice(0, 4)}`;
    }

    function formatearMinutos(minutos) {
        return `${Math.floor(minutos / 60)} h ${String(minutos % 60).padStart(2, '0')} min`;
    }

    function leerMinutos(fila, tipo) {
        const horas = fila.querySelector(`.horas-${tipo}`);
        const minutos = fila.querySelector(`.minutos-${tipo}`);
        for (const campo of [horas, minutos]) {
            if (campo.value.trim() === '' || !campo.checkValidity() || !Number.isInteger(Number(campo.value))) {
                throw new Error('Complete las horas y los minutos con números enteros válidos.');
            }
        }
        return Number(horas.value) * 60 + Number(minutos.value);
    }

    // ============================
    // CALCULAR TOTALES
    // ============================
    function calcularTotales() {
        let regulares = 0;
        let extras = 0;
        let valido = true;
        for (const fila of asistenciaBody.rows) {
            try {
                const regular = leerMinutos(fila, 'regulares');
                const extra = leerMinutos(fila, 'extras');
                if (regular + extra > 1440) throw new Error('Máximo diario superado.');
                regulares += regular;
                extras += extra;
            } catch { valido = false; }
        }
        document.getElementById('totalRegulares').textContent = valido ? formatearMinutos(regulares) : 'Revise los valores';
        document.getElementById('totalExtras').textContent = valido ? formatearMinutos(extras) : 'Revise los valores';
        document.getElementById('totalHoras').textContent = valido ? formatearMinutos(regulares + extras) : 'Revise los valores';
    }

    // ============================
    // GENERAR FILAS DEL RANGO
    // ============================
    function generarFilasAsistencia() {
        asistenciaBody.replaceChildren();
        rangoSemana.textContent = '';
        calcularTotales();
        const inicio = fechaUTC(inputDesde.value);
        const fin = fechaUTC(inputHasta.value);
        if (!inicio || !fin) return false;
        const dias = (fin - inicio) / 86400000 + 1;
        if (dias < 1 || dias > 31) {
            throw new Error('Seleccione un rango de 1 a 31 días, con la fecha final igual o posterior a la inicial.');
        }
        const nombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        for (let i = 0; i < dias; i++) {
            const dia = new Date(inicio.getTime() + i * 86400000);
            const fecha = dia.toISOString().slice(0, 10);
            const fila = document.createElement('tr');
            fila.dataset.fecha = fecha;
            fila.dataset.domingo = String(dia.getUTCDay() === 0);
            fila.innerHTML = `<td>${nombres[dia.getUTCDay()]}${dia.getUTCDay() === 0 ? ' (libre)' : ''}</td>
                <td class="fecha-asistencia" data-fecha="${fecha}" data-offset="${i}">${formatearFechaUSA(fecha)}</td>`;
            for (const tipo of ['regulares', 'extras']) {
                const celda = document.createElement('td');
                celda.innerHTML = `<div class="asistencia-tiempo">
                    <label>h <input type="number" class="horas-${tipo}" data-offset="${i}"
                        aria-label="Horas ${tipo}, ${fecha}" min="0" max="24" step="1" value="0" required></label>
                    <label>min <input type="number" class="minutos-${tipo}" data-offset="${i}"
                        aria-label="Minutos ${tipo}, ${fecha}" min="0" max="59" step="1" value="0" required></label>
                    </div>`;
                fila.appendChild(celda);
            }
            asistenciaBody.appendChild(fila);
        }
        rangoSemana.textContent = `${formatearFechaUSA(inputDesde.value)} - ${formatearFechaUSA(inputHasta.value)}`;
        return true;
    }

    // ============================
    // CARGAR EMPLEADOS
    // ============================
    async function cargarEmpleados() {
        const empleados = await leerRespuesta(await fetch('/api/empleados'));
        if (!Array.isArray(empleados)) throw new Error('La lista de empleados no es válida.');
        empleados.forEach(empleado => {
            const opcion = document.createElement('option');
            opcion.value = empleado.id_empleado;
            opcion.textContent = `${empleado.numero_empleado ?? empleado.id_empleado} - ${empleado.nombres} ${empleado.apellidos}`;
            selectEmpleado.appendChild(opcion);
        });
    }

    // ============================
    // CARGAR HORAS GUARDADAS
    // ============================
    async function cargarHorasGuardadas() {
        cargado = false;
        ocupado = true;
        actualizarControles();
        try {
            if (!generarFilasAsistencia() || !selectEmpleado.value) return;
            actualizarControles();
            const parametros = new URLSearchParams({ id_empleado: selectEmpleado.value,
                fecha_inicio: inputDesde.value, fecha_fin: inputHasta.value });
            const registros = await leerRespuesta(await fetch(`/api/asistencia?${parametros}`));
            if (!Array.isArray(registros)) throw new Error('La asistencia recibida no es válida.');
            for (const registro of registros) {
                const fecha = String(registro.fecha).split('T')[0];
                const fila = [...asistenciaBody.rows].find(fila => fila.dataset.fecha === fecha);
                if (!fila) continue;
                for (const [tipo, clave] of [['regulares', 'minutos_regulares'], ['extras', 'minutos_extras']]) {
                    const minutos = registro[clave];
                    if (!Number.isInteger(minutos) || minutos < 0 || minutos > 1440) {
                        throw new Error('Falta actualizar el servidor o migrar los minutos de asistencia.');
                    }
                    fila.querySelector(`.horas-${tipo}`).value = Math.floor(minutos / 60);
                    fila.querySelector(`.minutos-${tipo}`).value = minutos % 60;
                }
            }
            cargado = true;
            modificado = false;
        } catch (error) {
            alert(error.message);
        } finally {
            ocupado = false;
            actualizarControles();
            calcularTotales();
        }
    }

    // ============================
    // GUARDAR HORAS
    // ============================
    async function guardarHoras() {
        if (ocupado || !cargado) return;
        const registros = [];
        try {
            for (const fila of asistenciaBody.rows) {
                if (fila.dataset.domingo === 'true') continue;
                const regulares = leerMinutos(fila, 'regulares');
                const extras = leerMinutos(fila, 'extras');
                if (regulares + extras > 1440) throw new Error(`El ${fila.dataset.fecha} supera 24 horas.`);
                registros.push({ fecha: fila.dataset.fecha, minutos_regulares: regulares, minutos_extras: extras });
            }
            if (!registros.length) throw new Error('El rango solo contiene un domingo libre.');
            ocupado = true;
            actualizarControles();
            await leerRespuesta(await fetch('/api/asistencia', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_empleado: selectEmpleado.value, registros })
            }));
            modificado = false;
            alert('Horas y minutos guardados correctamente.');
        } catch (error) {
            alert(error.message);
        } finally {
            ocupado = false;
            actualizarControles();
        }
    }

    // ============================
    // SEMANA ACTUAL POR DEFECTO
    // ============================
    function mostrarSemanaActual() {
        const lunes = new Date();
        lunes.setDate(lunes.getDate() - (lunes.getDay() + 6) % 7);
        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate() + 6);
        inputDesde.value = fechaParaInput(lunes);
        inputHasta.value = fechaParaInput(domingo);
    }

    // ============================
    // CAMBIO DE FECHA O EMPLEADO
    // ============================
    controles.slice(0, 3).forEach(campo => campo.addEventListener('change', async () => {
        if (modificado && !confirm('Hay horas sin guardar. ¿Desea descartarlas y cambiar la selección?')) {
            controles.slice(0, 3).forEach((control, indice) => { control.value = seleccion[indice]; });
            return;
        }
        seleccion = controles.slice(0, 3).map(control => control.value);
        modificado = false;
        await cargarHorasGuardadas();
    }));

    // ============================
    // ACTUALIZAR TOTALES AL ESCRIBIR
    // ============================
    asistenciaBody.addEventListener('input', event => {
        if (event.target.matches('input')) {
            modificado = true;
            calcularTotales();
        }
    });
    window.addEventListener('beforeunload', event => {
        if (modificado || ocupado) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    // ============================
    // BOTÓN GUARDAR E INICIO
    // ============================
    btnGuardarHoras.addEventListener('click', guardarHoras);
    async function iniciar() {
        ocupado = true;
        actualizarControles();
        mostrarSemanaActual();
        try { await cargarEmpleados(); } catch (error) { alert(error.message); }
        seleccion = controles.slice(0, 3).map(control => control.value);
        await cargarHorasGuardadas();
    }
    iniciar();
});
