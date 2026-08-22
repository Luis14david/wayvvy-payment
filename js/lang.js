// =========================
// IDIOMAS DEL SISTEMA
// =========================

const traducciones = {

    es: {
        dashboard: "Dashboard",
        empleados: "Empleados",
        nomina: "Nómina",
        asistencia: "Asistencia",
        incentivos: "Incentivos",
        reportes: "Reportes",
        puestos: "Puestos",
        configuracion: "Configuración",
        cerrarSesion: "Cerrar sesión",

        bienvenido:
            "Bienvenido al sistema de Recursos Humanos y Nómina.",

        administrador: "Administrador",

        gestionEmpleados:
            "Gestión de empleados registrados.",

        nuevoEmpleado:
            "Nuevo empleado",

        numero: "No.",
        empleado: "Empleado",
        cedula: "Cédula",
        puesto: "Puesto",
        fechaIngreso: "Fecha de ingreso",
        estado: "Estado",
        acciones: "Acciones",
        ver: "Ver",

        activo: "Activo",
        inactivo: "Inactivo",
        suspendido: "Suspendido",
        licencia: "Licencia",
        vacaciones: "Vacaciones",

        sinPuesto: "Sin puesto",
        sinEstado: "Sin estado",

        detalleEmpleado: "Detalle del empleado",
        infoEmpleado: "Información registrada del empleado.",
        volver: "Volver",
        cargandoInfo: "Cargando información...",

        numeroEmpleado: "Número de empleado",
        nombreCompleto: "Nombre completo",
        sexo: "Sexo",
        fechaNacimiento: "Fecha de nacimiento",
        telefono: "Teléfono",
        correo: "Correo",
        direccion: "Dirección",
        salarioBase: "Salario base",
        editarEmpleado: "Editar empleado",

administracionPuestos: "Administración de puestos de trabajo.",
nuevoPuesto: "Nuevo puesto",
nombrePuesto: "Nombre del puesto",
descripcion: "Descripción",
guardarPuesto: "Guardar puesto",
cancelarEdicion: "Cancelar edición",
puestosRegistrados: "Puestos registrados",
cargandoPuestos: "Cargando puestos...",
sinDescripcion: "Sin descripción",
editarPuesto: "Editar puesto",
guardarCambios: "Guardar cambios",

confirmarCambios: "¿Seguro que desea guardar los cambios?",
errorGuardarPuesto: "No se pudo guardar el puesto",
errorGeneralPuesto: "Ocurrió un error al guardar el puesto."


    },


    en: {
        dashboard: "Dashboard",
        empleados: "Employees",
        nomina: "Payroll",
        asistencia: "Attendance",
        incentivos: "Incentives",
        reportes: "Reports",
        puestos: "Positions",
        configuracion: "Settings",
        cerrarSesion: "Log out",

        bienvenido:
            "Welcome to the Human Resources and Payroll system.",

        administrador: "Administrator",

        gestionEmpleados:
            "Registered employee management.",

        nuevoEmpleado:
            "New employee",

        numero: "No.",
        empleado: "Employee",
        cedula: "ID Number",
        puesto: "Position",
        fechaIngreso: "Hire date",
        estado: "Status",
        acciones: "Actions",
        ver: "View",

        activo: "Active",
        inactivo: "Inactive",
        suspendido: "Suspended",
        licencia: "Leave",
        vacaciones: "Vacation",

        sinPuesto: "No position",
        sinEstado: "No status",
        editarEmpleado: "Edit employee",

          detalleEmpleado: "Employee details",
    infoEmpleado: "Registered employee information.",
    volver: "Back",
    cargandoInfo: "Loading information...",

    numeroEmpleado: "Employee number",
    nombreCompleto: "Full name",
    sexo: "Gender",
    fechaNacimiento: "Date of birth",
    telefono: "Phone",
    correo: "Email",
    direccion: "Address",
    salarioBase: "Base salary",

administracionPuestos: "Job position management.",
nuevoPuesto: "New position",
nombrePuesto: "Position name",
descripcion: "Description",
guardarPuesto: "Save position",
cancelarEdicion: "Cancel editing",
puestosRegistrados: "Registered positions",
cargandoPuestos: "Loading positions...",
sinDescripcion: "No description",
editarPuesto: "Edit position",
guardarCambios: "Save changes",

confirmarCambios: "Are you sure you want to save the changes?",
errorGuardarPuesto: "The position could not be saved",
errorGeneralPuesto: "An error occurred while saving the position."

    }

  };


// =========================
// IDIOMA ACTUAL
// =========================

let idiomaActual =
    localStorage.getItem("idioma") || "es";


// =========================
// OBTENER TRADUCCIÓN
// =========================

function t(clave) {

    return traducciones[idiomaActual][clave]
        || clave;

}


// =========================
// CAMBIAR IDIOMA
// =========================

function cambiarIdioma(nuevoIdioma) {

    idiomaActual = nuevoIdioma;

    localStorage.setItem(
        "idioma",
        nuevoIdioma
    );

    aplicarTraducciones();


    // Recargar el módulo que está abierto
    const opcionActiva =
        document.querySelector(
            ".sidebar a[data-page].active"
        );

    if (opcionActiva) {
        opcionActiva.click();
    }
}


// =========================
// TRADUCIR ELEMENTOS DEL HTML
// =========================

function aplicarTraducciones() {

    const elementos =
        document.querySelectorAll("[data-i18n]");

    elementos.forEach(function(elemento) {

        const clave =
            elemento.dataset.i18n;

        elemento.textContent =
            t(clave);

    });

}


// =========================
// APLICAR IDIOMA AL CARGAR
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        aplicarTraducciones();

    }
);