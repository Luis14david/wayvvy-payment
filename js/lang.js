// =========================
// IDIOMAS DEL SISTEMA
// =========================

const traducciones = {

    es: {

        // =========================
        // MENÚ
        // =========================

        dashboard: "Dashboard",
        empleados: "Empleados",
        nomina: "Nómina",
        asistencia: "Asistencia",
        incentivos: "Incentivos",
        reportes: "Reportes",
        puestos: "Puestos",
        configuracion: "Configuración",
        cerrarSesion: "Cerrar sesión",


        // =========================
        // DASHBOARD
        // =========================

        bienvenido:
            "Bienvenido al sistema de Recursos Humanos y Nómina.",

        administrador: "Administrador",


        // =========================
        // EMPLEADOS
        // =========================

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

        editarEmpleado: "Editar empleado",


        // =========================
        // ESTADOS
        // =========================

        activo: "Activo",
        inactivo: "Inactivo",
        suspendido: "Suspendido",
        licencia: "Licencia",
        vacaciones: "Vacaciones",

        sinPuesto: "Sin puesto",
        sinEstado: "Sin estado",


        // =========================
        // VER EMPLEADO
        // =========================

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


        // =========================
        // FORMULARIO EMPLEADO
        // =========================

        nombre: "Nombre",
        apellido: "Apellido",
        cedulaFormulario: "Cédula",
        sexoFormulario: "Sexo",
        fechaNacimientoFormulario: "Fecha de nacimiento",
        telefonoFormulario: "Teléfono",
        correoElectronico: "Correo electrónico",
        direccionFormulario: "Dirección",
        fechaIngresoFormulario: "Fecha de ingreso",
        salarioBaseFormulario: "Salario base",
        puestoFormulario: "Puesto",
        estadoFormulario: "Estado",

        seleccionarPuesto: "Seleccione un puesto...",
        seleccionarEstado: "Seleccione un estado...",

        cancelar: "Cancelar",
        agregarEmpleado: "Agregar empleado",


        // =========================
        // PUESTOS
        // =========================

        administracionPuestos:
            "Administración de puestos de trabajo.",

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

        confirmarCambios:
            "¿Seguro que desea guardar los cambios?",

        errorGuardarPuesto:
            "No se pudo guardar el puesto",

        errorGeneralPuesto:
            "Ocurrió un error al guardar el puesto.",

            guardarCambiosEmpleado: "Guardar cambios",
sinCambios: "No se han realizado cambios.",
confirmarGuardarEmpleado: "¿Seguro que desea guardar los cambios realizados?",
cambiosSinGuardar: "Hay cambios sin guardar. ¿Seguro que desea salir?",
datosSinGuardar: "Hay datos ingresados en el formulario. ¿Seguro que desea cancelar?",
errorCargarFormulario: "No se pudieron cargar los datos del formulario.",
errorActualizarEmpleado: "Ocurrió un error al actualizar el empleado.",

telefonoPlaceholder: "Ej: 809-555-1234",
correoPlaceholder: "ejemplo@correo.com",
direccionPlaceholder: "Calle, número, ciudad",

empleadoActualizado: "Empleado actualizado correctamente.",
        
moduloDesarrollo: "Módulo en desarrollo",
seccionProximamente: "Esta sección será implementada próximamente.",

confirmarCerrarSesion: "¿Seguro que desea cerrar sesión?",


gestionAsistencia: "Registro de horas trabajadas por empleado.",
seleccionarEmpleado: "Seleccionar empleado",
seleccionarSemana: "Seleccionar semana",
empleadoAsistencia: "Empleado",
semanaAsistencia: "Semana",
horasRegulares: "Horas regulares",
horasExtras: "Horas extras",
totalHoras: "Total de horas",
guardarHoras: "Guardar horas",

lunes: "Lunes",
martes: "Martes",
miercoles: "Miércoles",
jueves: "Jueves",
viernes: "Viernes",
sabado: "Sábado",
domingo: "Domingo",

seleccioneEmpleadoAsistencia: "Seleccione un empleado.",
horasGuardadas: "Horas guardadas correctamente.",
errorGuardarHoras: "No se pudieron guardar las horas.",

horasInvalidas: "Las horas no pueden ser negativas.",
horasDiaExcedidas: "La suma de horas regulares y extras no puede superar 24 horas en un día.",

semanaAnterior: "Semana anterior",
semanaSiguiente: "Semana siguiente",

desde: "Desde",
hasta: "Hasta",
rangoPersonalizado: "Rango personalizado",
usarSemanaActual: "Usar semana actual",
rangoFechaInvalido: "La fecha final no puede ser anterior a la fecha inicial.",
rangoDemasiadoGrande: "El rango seleccionado no puede superar 31 días.",

gestionReportes: "Consulta y generación de reportes.",
reporteHoras: "Reporte de horas trabajadas",
empleadoReporte: "Empleado",
desdeReporte: "Desde",
hastaReporte: "Hasta",
generarReporte: "Generar reporte",
todosEmpleados: "Todos los empleados",
totalRegularesReporte: "Total horas regulares",
totalExtrasReporte: "Total horas extras",
totalHorasReporte: "Total de horas",

fechaReporte: "Fecha",
numeroEmpleadoReporte: "No.",
nombreEmpleadoReporte: "Empleado",
estadoReporte: "Estado",
sinResultadosReporte: "No se encontraron registros para el período seleccionado.",
resumenReporte: "Resumen del período",

comprobantePago: "Comprobante de pago",
generarComprobante: "Generar comprobante",
periodoPago: "Período de pago",

datosEmpleado: "Datos del empleado",
ocupacion: "Ocupación",

ingresos: "Ingresos",
horasTrabajadas: "Horas trabajadas",
valorHora: "Valor por hora",
salarioDevengado: "Salario devengado",
incentivosPago: "Incentivos",
vacacionesPago: "Vacaciones",
totalDevengado: "Total devengado",

deducciones: "Deducciones",
afp: "AFP",
sfs: "SFS",
isr: "ISR",
dependientes: "Dependientes",
otrosDescuentos: "Otros descuentos",
totalDeducciones: "Total deducciones",

netoPagar: "Neto a pagar",

firmaColaborador: "Firma del colaborador",
firmaSupervisor: "Firma del supervisor"

},


    en: {

        // =========================
        // MENU
        // =========================

        dashboard: "Dashboard",
        empleados: "Employees",
        nomina: "Payroll",
        asistencia: "Attendance",
        incentivos: "Incentives",
        reportes: "Reports",
        puestos: "Positions",
        configuracion: "Settings",
        cerrarSesion: "Log out",


        // =========================
        // DASHBOARD
        // =========================

        bienvenido:
            "Welcome to the Human Resources and Payroll system.",

        administrador: "Administrator",


        // =========================
        // EMPLOYEES
        // =========================

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

        editarEmpleado: "Edit employee",


        // =========================
        // STATUS
        // =========================

        activo: "Active",
        inactivo: "Inactive",
        suspendido: "Suspended",
        licencia: "Leave",
        vacaciones: "Vacation",

        sinPuesto: "No position",
        sinEstado: "No status",


        // =========================
        // VIEW EMPLOYEE
        // =========================

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


        // =========================
        // EMPLOYEE FORM
        // =========================

        nombre: "First name",
        apellido: "Last name",
        cedulaFormulario: "ID Number",
        sexoFormulario: "Gender",
        fechaNacimientoFormulario: "Date of birth",
        telefonoFormulario: "Phone",
        correoElectronico: "Email",
        direccionFormulario: "Address",
        fechaIngresoFormulario: "Hire date",
        salarioBaseFormulario: "Base salary",
        puestoFormulario: "Position",
        estadoFormulario: "Status",

        seleccionarPuesto: "Select a position...",
        seleccionarEstado: "Select a status...",

        cancelar: "Cancel",
        agregarEmpleado: "Add employee",


        // =========================
        // POSITIONS
        // =========================

        administracionPuestos:
            "Job position management.",

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

        confirmarCambios:
            "Are you sure you want to save the changes?",

        errorGuardarPuesto:
            "The position could not be saved",

        errorGeneralPuesto:
            "An error occurred while saving the position.",

          guardarCambiosEmpleado: "Save changes",
sinCambios: "No changes have been made.",
confirmarGuardarEmpleado: "Are you sure you want to save the changes?",
cambiosSinGuardar: "There are unsaved changes. Are you sure you want to leave?",
datosSinGuardar: "There is information entered in the form. Are you sure you want to cancel?",
errorCargarFormulario: "The form data could not be loaded.",
errorActualizarEmpleado: "An error occurred while updating the employee.", 

telefonoPlaceholder: "Ex: 809-555-1234",
correoPlaceholder: "example@email.com",
direccionPlaceholder: "Street, number, city",

empleadoActualizado: "Employee updated successfully.",

moduloDesarrollo: "Module under development",
seccionProximamente: "This section will be implemented soon.",

confirmarCerrarSesion: "Are you sure you want to log out?",

gestionAsistencia: "Employee work hours management.",
seleccionarEmpleado: "Select employee",
seleccionarSemana: "Select week",
empleadoAsistencia: "Employee",
semanaAsistencia: "Week",
horasRegulares: "Regular hours",
horasExtras: "Overtime hours",
totalHoras: "Total hours",
guardarHoras: "Save hours",

lunes: "Monday",
martes: "Tuesday",
miercoles: "Wednesday",
jueves: "Thursday",
viernes: "Friday",
sabado: "Saturday",
domingo: "Sunday",

seleccioneEmpleadoAsistencia: "Select an employee.",
horasGuardadas: "Hours saved successfully.",
errorGuardarHoras: "The hours could not be saved.",

horasInvalidas: "Hours cannot be negative.",
horasDiaExcedidas: "Regular and overtime hours cannot exceed 24 hours in a single day.",

semanaAnterior: "Previous week",
semanaSiguiente: "Next week",

desde: "From",
hasta: "To",
rangoPersonalizado: "Custom date range",
usarSemanaActual: "Use current week",
rangoFechaInvalido: "The end date cannot be earlier than the start date.",
rangoDemasiadoGrande: "The selected range cannot exceed 31 days.",

gestionReportes: "Report consultation and generation.",
reporteHoras: "Worked hours report",
empleadoReporte: "Employee",
desdeReporte: "From",
hastaReporte: "To",
generarReporte: "Generate report",
todosEmpleados: "All employees",
totalRegularesReporte: "Total regular hours",
totalExtrasReporte: "Total overtime hours",
totalHorasReporte: "Total hours",

fechaReporte: "Date",
numeroEmpleadoReporte: "No.",
nombreEmpleadoReporte: "Employee",
estadoReporte: "Status",
sinResultadosReporte: "No records were found for the selected period.",
resumenReporte: "Period summary",

comprobantePago: "Payroll receipt",
generarComprobante: "Generate receipt",
periodoPago: "Pay period",

datosEmpleado: "Employee information",
ocupacion: "Position",

ingresos: "Earnings",
horasTrabajadas: "Hours worked",
valorHora: "Hourly rate",
salarioDevengado: "Earned salary",
incentivosPago: "Incentives",
vacacionesPago: "Vacation",
totalDevengado: "Total earnings",

deducciones: "Deductions",
afp: "AFP",
sfs: "SFS",
isr: "Income tax",
dependientes: "Dependents",
otrosDescuentos: "Other deductions",
totalDeducciones: "Total deductions",

netoPagar: "Net pay",

firmaColaborador: "Employee signature",
firmaSupervisor: "Supervisor signature"

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
        document.querySelectorAll(
            "[data-i18n]"
        );


    elementos.forEach(
        function(elemento) {

            const clave =
                elemento.dataset.i18n;

            elemento.textContent =
                t(clave);

            const placeholders =
    document.querySelectorAll(
        "[data-i18n-placeholder]"
    );

placeholders.forEach(
    function(elemento) {

        const clave =
            elemento.dataset.i18nPlaceholder;

        elemento.placeholder =
            t(clave);

    }
);

        }
    );

const botonesIdioma =
    document.querySelectorAll(
        ".language-button, .employee-language-switch button"
    );

botonesIdioma.forEach(function(boton) {

    boton.classList.remove("idioma-activo");

    if (
        boton.textContent
            .trim()
            .toLowerCase() === idiomaActual
    ) {
        boton.classList.add("idioma-activo");
    }

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