const btnCancelar = document.getElementById('btnCancelar');
const formulario = document.querySelector('.employee-form');
const selectPuesto = document.getElementById('id_puesto');
const botonGuardar = document.querySelector('.btn-agregar');
const parametros = new URLSearchParams(window.location.search);
const idEmpleado = parametros.get('id');
const campoTarifa = document.getElementById('salario_base');
const nuevaTarifa = document.getElementById('nueva_tarifa');
const fechaTarifa = document.getElementById('fecha_tarifa');
const motivoTarifa = document.getElementById('motivo_tarifa');
let estadoInicial = null;
let historialTarifas = [];
let listo = false;
let guardando = false;

// ==========================================
// OBTENER ESTADO ACTUAL DEL FORMULARIO
// ==========================================
function obtenerEstadoFormulario() {
    return JSON.stringify(Object.fromEntries(new FormData(formulario).entries()));
}

async function leerRespuesta(response) {
    let resultado;
    try { resultado = await response.json(); } catch {
        throw new Error('El servidor no devolvió una respuesta válida. Compruebe que está actualizado.');
    }
    if (!response.ok) throw new Error(resultado.error || 'No se pudo completar la operación.');
    return resultado;
}

function actualizarControles() {
    formulario.querySelectorAll('input, select').forEach(campo => { campo.disabled = !listo || guardando; });
    botonGuardar.disabled = !listo || guardando;
    if (!listo || guardando) return;
    const cambioTarifa = Boolean(idEmpleado && nuevaTarifa.value.trim());
    nuevaTarifa.disabled = !idEmpleado;
    fechaTarifa.disabled = Boolean(idEmpleado && !cambioTarifa);
    fechaTarifa.required = !idEmpleado || cambioTarifa;
    motivoTarifa.disabled = !cambioTarifa;
    motivoTarifa.required = cambioTarifa;
}

// ==========================================
// CARGAR PUESTOS Y ESTADOS
// ==========================================
async function cargarPuestos() {
    const puestos = await leerRespuesta(await fetch('/api/puestos'));
    puestos.forEach(puesto => {
        const opcion = document.createElement('option');
        opcion.value = puesto.id_puesto;
        opcion.textContent = puesto.nombre_puesto;
        selectPuesto.appendChild(opcion);
    });
}

async function cargarEstados() {
    const estados = await leerRespuesta(await fetch('/api/estados-empleado'));
    estados.forEach(estado => {
        const opcion = document.createElement('option');
        const claveEstado = estado.trim().toLowerCase();
        opcion.value = claveEstado;
        opcion.dataset.i18n = claveEstado;
        opcion.textContent = t(claveEstado);
        document.getElementById('estado').appendChild(opcion);
    });
}

// ==========================================
// CARGAR EMPLEADO PARA EDITAR
// ==========================================
async function cargarEmpleado() {
    if (!idEmpleado) return;
    const empleado = await leerRespuesta(await fetch(`/api/empleados/${encodeURIComponent(idEmpleado)}`));
    for (const campo of ['nombres', 'apellidos', 'cedula', 'sexo', 'telefono', 'correo', 'direccion']) {
        document.getElementById(campo).value = empleado[campo] || '';
    }
    document.getElementById('nacimiento').value = empleado.fecha_nacimiento ? empleado.fecha_nacimiento.split('T')[0] : '';
    document.getElementById('fecha_ingreso').value = empleado.fecha_ingreso ? empleado.fecha_ingreso.split('T')[0] : '';
    campoTarifa.value = empleado.salario_base ?? '';
    campoTarifa.readOnly = true;
    campoTarifa.required = false;
    campoTarifa.placeholder = 'Sin tarifa vigente hoy';
    document.querySelector('label[for="salario_base"]').textContent = 'Tarifa vigente hoy (RD$ por hora)';
    selectPuesto.value = empleado.id_puesto || '';
    document.getElementById('estado').value = (empleado.estado || '').toLowerCase();
    botonGuardar.dataset.i18n = 'guardarCambiosEmpleado';
    botonGuardar.textContent = t('guardarCambiosEmpleado');
}

// ==========================================
// HISTORIAL Y VIGENCIA DE TARIFAS
// ==========================================
async function cargarTarifas() {
    if (!idEmpleado) return;
    historialTarifas = await leerRespuesta(await fetch(`/api/empleados/${encodeURIComponent(idEmpleado)}/tarifas`));
    if (!Array.isArray(historialTarifas) || !historialTarifas.length) {
        throw new Error('Falta inicializar el historial de tarifas de este empleado.');
    }
    document.getElementById('grupoNuevaTarifa').hidden = false;
    document.getElementById('grupoMotivoTarifa').hidden = false;
    document.getElementById('historialTarifas').hidden = false;
    const cuerpo = document.getElementById('tarifasBody');
    cuerpo.replaceChildren();
    for (const tarifa of historialTarifas) {
        const fila = document.createElement('tr');
        const partes = tarifa.fecha_inicio.split('-');
        for (const texto of [`${partes[2]}/${partes[1]}/${partes[0]}`, Number(tarifa.tarifa_hora).toFixed(2), tarifa.motivo_cambio || '']) {
            const celda = document.createElement('td');
            celda.textContent = texto;
            fila.appendChild(celda);
        }
        cuerpo.appendChild(fila);
    }
    document.getElementById('estadoTarifas').textContent =
        'Cada monto se aplica desde su fecha hasta el día anterior al siguiente cambio. Una fecha futura no cambia la tarifa de hoy.';
    const siguiente = new Date(`${historialTarifas[0].fecha_inicio}T00:00:00Z`);
    siguiente.setUTCDate(siguiente.getUTCDate() + 1);
    fechaTarifa.min = siguiente.toISOString().slice(0, 10);
    fechaTarifa.value = '';
}

function ajustarInicioTarifa() {
    if (idEmpleado) return;
    const ingreso = document.getElementById('fecha_ingreso').value;
    const minimo = ingreso > '2026-08-25' ? ingreso : '2026-08-25';
    fechaTarifa.min = minimo;
    if (!fechaTarifa.value || fechaTarifa.value < minimo) fechaTarifa.value = minimo;
}

nuevaTarifa.addEventListener('input', actualizarControles);
document.getElementById('fecha_ingreso').addEventListener('change', ajustarInicioTarifa);

// ==========================================
// INICIAR FORMULARIO
// ==========================================
async function iniciarFormulario() {
    actualizarControles();
    try {
        await cargarPuestos();
        await cargarEstados();
        await cargarEmpleado();
        await cargarTarifas();
        ajustarInicioTarifa();
        listo = true;
        actualizarControles();
        estadoInicial = obtenerEstadoFormulario();
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================
// BOTÓN CANCELAR
// ==========================================
btnCancelar.addEventListener('click', event => {
    event.preventDefault();
    if (guardando) return;
    if (!listo || obtenerEstadoFormulario() === estadoInicial || confirm(t('cambiosSinGuardar'))) {
        window.location.href = '/html/empleados.html';
    }
});

window.addEventListener('beforeunload', event => {
    if (guardando || (listo && estadoInicial !== obtenerEstadoFormulario())) {
        event.preventDefault();
        event.returnValue = '';
    }
});

// ==========================================
// GUARDAR EMPLEADO Y CAMBIO DE TARIFA
// ==========================================
formulario.addEventListener('submit', async event => {
    event.preventDefault();
    if (!listo || guardando || !formulario.reportValidity()) return;
    if (idEmpleado && estadoInicial === obtenerEstadoFormulario()) {
        alert(t('sinCambios'));
        return;
    }
    const datos = Object.fromEntries(new FormData(formulario).entries());
    if (idEmpleado) {
        datos.id_historial_esperado = historialTarifas[0].id_historial;
        delete datos.salario_base;
    }
    guardando = true;
    actualizarControles();
    try {
        await leerRespuesta(await fetch(idEmpleado ? `/api/empleados/${encodeURIComponent(idEmpleado)}` : '/registrar', {
            method: idEmpleado ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        }));
        alert(idEmpleado ? 'Empleado y cambios guardados correctamente.' : 'Empleado y tarifa inicial guardados correctamente.');
        listo = false;
        guardando = false;
        window.location.href = '/html/empleados.html';
    } catch (error) {
        guardando = false;
        actualizarControles();
        alert(error.message);
    }
});

iniciarFormulario();
