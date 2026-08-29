const btnCancelar = document.getElementById("btnCancelar");
const formulario = document.querySelector(".employee-form");
const selectPuesto = document.getElementById("id_puesto");
const botonGuardar = document.querySelector(".btn-agregar");

const parametros = new URLSearchParams(window.location.search);
const idEmpleado = parametros.get("id");

let estadoInicial = null;


// ==========================================
// OBTENER ESTADO ACTUAL DEL FORMULARIO
// ==========================================

function obtenerEstadoFormulario() {

    const datos = new FormData(formulario);

    return JSON.stringify(
        Object.fromEntries(datos.entries())
    );
}


// ==========================================
// CARGAR PUESTOS
// ==========================================

async function cargarPuestos() {

    const response = await fetch("/api/puestos");

    if (!response.ok) {
        throw new Error("No se pudieron cargar los puestos");
    }

    const puestos = await response.json();

    puestos.forEach(puesto => {

        const opcion = document.createElement("option");

        opcion.value = puesto.id_puesto;
        opcion.textContent = puesto.nombre_puesto;

        selectPuesto.appendChild(opcion);
    });
}

async function cargarEstados() {

    const selectEstado = document.getElementById("estado");

    const response = await fetch("/api/estados-empleado");

    if (!response.ok) {
        throw new Error("No se pudieron cargar los estados");
    }

    const estados = await response.json();

    estados.forEach(function(estado) {

    const opcion =
        document.createElement("option");

    const claveEstado =
        estado
            .trim()
            .toLowerCase();

    // El valor que se guarda permanece igual
    opcion.value = claveEstado;

    // Permitimos que lang.js traduzca la opción
    opcion.dataset.i18n = claveEstado;

    // Texto inicial según el idioma actual
    opcion.textContent = t(claveEstado);

    selectEstado.appendChild(opcion);
});
}


// ==========================================
// CARGAR EMPLEADO PARA EDITAR
// ==========================================

async function cargarEmpleado() {

    if (!idEmpleado) {
        return;
    }

    const response = await fetch(`/api/empleados/${idEmpleado}`);

    if (!response.ok) {
        throw new Error("No se pudo cargar el empleado");
    }

    const empleado = await response.json();

    document.getElementById("nombres").value =
        empleado.nombres || "";

    document.getElementById("apellidos").value =
        empleado.apellidos || "";

    document.getElementById("cedula").value =
        empleado.cedula || "";

    document.getElementById("sexo").value =
        empleado.sexo || "";

    document.getElementById("nacimiento").value =
        empleado.fecha_nacimiento
            ? empleado.fecha_nacimiento.split("T")[0]
            : "";

    document.getElementById("telefono").value =
        empleado.telefono || "";

    document.getElementById("correo").value =
        empleado.correo || "";

    document.getElementById("direccion").value =
        empleado.direccion || "";

    document.getElementById("fecha_ingreso").value =
        empleado.fecha_ingreso
            ? empleado.fecha_ingreso.split("T")[0]
            : "";

    document.getElementById("salario_base").value =
        empleado.salario_base || "";

    selectPuesto.value =
        empleado.id_puesto || "";

    document.getElementById("estado").value =
        empleado.estado
            ? empleado.estado.toLowerCase()
            : "";

    botonGuardar.dataset.i18n =
    "guardarCambiosEmpleado";

botonGuardar.textContent =
    t("guardarCambiosEmpleado");

    // Guardamos cómo estaba el formulario originalmente
    estadoInicial = obtenerEstadoFormulario();
}


// ==========================================
// INICIAR FORMULARIO
// ==========================================

async function iniciarFormulario() {
    try {
        await cargarPuestos();
        await cargarEstados();
        await cargarEmpleado();

    } catch (error) {
        console.error("Error al iniciar formulario:", error);
       alert(t("errorCargarFormulario"));
    }
}

iniciarFormulario();


// ==========================================
// BOTÓN CANCELAR
// ==========================================

btnCancelar.addEventListener("click", function(event) {

    event.preventDefault();


    // --------------------------------------
    // MODO EDITAR
    // --------------------------------------

    if (idEmpleado) {

        const estadoActual = obtenerEstadoFormulario();

        // No se modificó absolutamente nada
        if (estadoActual === estadoInicial) {

            window.location.href = "/app.html?pagina=empleados";
            return;
        }

        // Hay cambios sin guardar
        const confirmarSalida = confirm(
            t("cambiosSinGuardar")
        );

        if (confirmarSalida) {
           window.location.href = "/app.html?pagina=empleados";
        }

        return;
    }


    // --------------------------------------
    // MODO REGISTRAR
    // --------------------------------------

    const campos = formulario.querySelectorAll("input, select");

    let hayDatos = false;

    campos.forEach(campo => {

        if (campo.value.trim() !== "") {
            hayDatos = true;
        }

    });

    // Formulario completamente vacío
    if (!hayDatos) {

        window.location.href = "/app.html?pagina=empleados";
        return;
    }

    // Hay datos ingresados
    const confirmarCancelacion = confirm(
    t("datosSinGuardar")
);

    if (confirmarCancelacion) {
        window.location.href = "/app.html?pagina=empleados";
    }
});


// ==========================================
// GUARDAR CAMBIOS
// ==========================================

if (idEmpleado) {

    formulario.addEventListener("submit", async function(event) {

        event.preventDefault();

        const estadoActual = obtenerEstadoFormulario();


        // No se modificó nada
        if (estadoActual === estadoInicial) {

            alert(t("sinCambios"));
            return;
        }


        // Confirmación antes de guardar
        const confirmarGuardado = confirm(
    t("confirmarGuardarEmpleado")
);
        if (!confirmarGuardado) {
            return;
        }


        const datosEmpleado = {

            nombres:
                document.getElementById("nombres").value,

            apellidos:
                document.getElementById("apellidos").value,

            cedula:
                document.getElementById("cedula").value,

            sexo:
                document.getElementById("sexo").value,

            nacimiento:
                document.getElementById("nacimiento").value,

            telefono:
                document.getElementById("telefono").value,

            correo:
                document.getElementById("correo").value,

            direccion:
                document.getElementById("direccion").value,

            fecha_ingreso:
                document.getElementById("fecha_ingreso").value,

            salario_base:
                document.getElementById("salario_base").value,

            id_puesto:
                document.getElementById("id_puesto").value,

            estado:
                document.getElementById("estado").value
        };


        try {

            const response = await fetch(
                `/api/empleados/${idEmpleado}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(datosEmpleado)
                }
            );


            if (!response.ok) {
                throw new Error(
                    "No se pudo actualizar el empleado"
                );
            }


            const resultado = await response.json();

            alert(
    t("empleadoActualizado")
);

            window.location.href = "/app.html?pagina=empleados";


        } catch (error) {

            console.error(
                "Error al actualizar empleado:",
                error
            );

            alert(
    t("errorActualizarEmpleado")
);
        }

    });
}