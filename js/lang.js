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
        firmaSupervisor: "Firma del supervisor",

        gestionIncentivos: "Gestión de incentivos",
        nuevoIncentivo: "Nuevo incentivo",
        periodoNomina: "Período de nómina",
        montoIncentivo: "Monto del incentivo",
        descripcionIncentivo: "Descripción",
        guardarIncentivo: "Guardar incentivo",
        seleccionarNomina: "Seleccionar período",
        incentivoGuardado: "Incentivo guardado correctamente",
        errorGuardarIncentivo: "No se pudo guardar el incentivo",

        incentivosRegistrados: "Incentivos registrados",
        monto: "Monto",
        sinIncentivos: "No hay incentivos registrados para este período.",

        editarIncentivo: "Editar",
        eliminarIncentivo: "Eliminar",
        guardarCambiosIncentivo: "Guardar cambios",
        cancelarEdicionIncentivo: "Cancelar",
        confirmarEliminarIncentivo: "¿Seguro que desea eliminar este incentivo?",
        incentivoActualizado: "Incentivo actualizado correctamente",
        incentivoEliminado: "Incentivo eliminado correctamente",
        errorActualizarIncentivo: "No se pudo actualizar el incentivo",
        errorEliminarIncentivo: "No se pudo eliminar el incentivo",


        // =========================
        // PERFIL, DASHBOARD Y NÓMINA
        // =========================

        miPerfil: "Mi perfil",
        imagenPerfil: "Imagen de perfil",
        resumenDashboard: "Resumen general de Wayvvy Payroll",
        totalEmpleados: "Total de empleados",
        empleadosActivos: "Empleados activos",
        nominasBorrador: "Nóminas en borrador",
        listaEmpleados: "Lista de empleados",
        buscarEmpleado: "Buscar empleado...",
        dia: "Día",
        seleccionarFechaInicial: "Seleccionar fecha inicial",
        seleccionarFechaFinal: "Seleccionar fecha final",
        gestionNominas: "Gestión de períodos de nómina",
        nuevaNomina: "Nueva nómina",
        nominasRegistradas: "Nóminas registradas",
        periodo: "Período",
        fechaInicio: "Fecha inicio",
        fechaFin: "Fecha fin",
        fechaPago: "Fecha de pago",
        anio: "Año",
        borrador: "Borrador",
        procesada: "Procesada",
        pagada: "Pagada",
        anulada: "Anulada",
        cargandoNominas: "Cargando nóminas...",
        sinNominas: "No hay nóminas registradas.",
        errorCargarNominas: "No se pudieron cargar las nóminas.",
        crearBorrador: "Crear nómina",
        guardando: "Guardando...",
        nominaCreada: "Nómina creada.",
        avisoBorrador: "El período se guardará en estado Borrador.",
        avisoAnioNomina: "El año de la nómina se tomará de la fecha de pago.",
        errorCrearNomina: "No se pudo crear la nómina.",
        detalleNomina: "Detalle de nómina",
        volverNominas: "Volver a nóminas",
        cargandoNomina: "Cargando nómina...",
        idNominaInvalido: "El identificador de nómina no es válido.",
        nominaNoExiste: "La nómina no existe.",
        errorCargarNomina: "No se pudo cargar la nómina.",
        totalBrutoRegistrado: "Total bruto registrado",
        deduccionesRegistradas: "Deducciones registradas",
        netoRegistrado: "Neto registrado",
        sinCalcular: "Sin calcular",
        detallePorEmpleado: "Detalle por empleado",
        salarioBruto: "Salario bruto",
        neto: "Neto",
        avisoImportesNomina: "Los importes corresponden a los valores guardados. Una nómina en borrador puede tener cálculos pendientes.",
        sinEmpleadosNomina: "Esta nómina todavía no tiene empleados registrados en su detalle.",

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
        firmaSupervisor: "Supervisor signature",

        gestionIncentivos: "Incentive management",
        nuevoIncentivo: "New incentive",
        periodoNomina: "Payroll period",
        montoIncentivo: "Incentive amount",
        descripcionIncentivo: "Description",
        guardarIncentivo: "Save incentive",
        seleccionarNomina: "Select period",
        incentivoGuardado: "Incentive saved successfully",
        errorGuardarIncentivo: "Could not save the incentive",

        incentivosRegistrados: "Registered incentives",
        monto: "Amount",
        sinIncentivos: "There are no incentives registered for this period.",

        editarIncentivo: "Edit",
        eliminarIncentivo: "Delete",
        guardarCambiosIncentivo: "Save changes",
        cancelarEdicionIncentivo: "Cancel",
        confirmarEliminarIncentivo: "Are you sure you want to delete this incentive?",
        incentivoActualizado: "Incentive updated successfully",
        incentivoEliminado: "Incentive deleted successfully",
        errorActualizarIncentivo: "Could not update the incentive",
        errorEliminarIncentivo: "Could not delete the incentive",


        // =========================
        // PERFIL, DASHBOARD Y NÓMINA
        // =========================

        miPerfil: "My profile",
        imagenPerfil: "Profile picture",
        resumenDashboard: "Wayvvy Payroll overview",
        totalEmpleados: "Total employees",
        empleadosActivos: "Active employees",
        nominasBorrador: "Draft payrolls",
        listaEmpleados: "Employee list",
        buscarEmpleado: "Search employees...",
        dia: "Day",
        seleccionarFechaInicial: "Select start date",
        seleccionarFechaFinal: "Select end date",
        gestionNominas: "Payroll period management",
        nuevaNomina: "New payroll",
        nominasRegistradas: "Registered payrolls",
        periodo: "Period",
        fechaInicio: "Start date",
        fechaFin: "End date",
        fechaPago: "Payment date",
        anio: "Year",
        borrador: "Draft",
        procesada: "Processed",
        pagada: "Paid",
        anulada: "Cancelled",
        cargandoNominas: "Loading payrolls...",
        sinNominas: "No payrolls have been registered.",
        errorCargarNominas: "Payrolls could not be loaded.",
        crearBorrador: "Create draft",
        guardando: "Saving...",
        nominaCreada: "Payroll created.",
        avisoBorrador: "The period will be saved as a draft.",
        avisoAnioNomina: "The payroll year will be taken from the payment date.",
        errorCrearNomina: "The payroll could not be created.",
        detalleNomina: "Payroll details",
        volverNominas: "Back to payrolls",
        cargandoNomina: "Loading payroll...",
        idNominaInvalido: "The payroll identifier is invalid.",
        nominaNoExiste: "The payroll does not exist.",
        errorCargarNomina: "The payroll could not be loaded.",
        totalBrutoRegistrado: "Recorded gross total",
        deduccionesRegistradas: "Recorded deductions",
        netoRegistrado: "Recorded net total",
        sinCalcular: "Not calculated",
        detallePorEmpleado: "Employee breakdown",
        salarioBruto: "Gross salary",
        neto: "Net pay",
        avisoImportesNomina: "Amounts reflect the stored values. A draft payroll may still have pending calculations.",
        sinEmpleadosNomina: "This payroll does not have any employees registered in its details yet.",

    }

};

// =========================
// IDIOMA ACTUAL
// =========================

let idiomaActual = "es";

try {
    const idiomaGuardado = localStorage.getItem("idioma");

    if (idiomaGuardado === "es" || idiomaGuardado === "en") {
        idiomaActual = idiomaGuardado;
    }
} catch (error) {
    console.warn("No se pudo leer el idioma guardado.");
}


// =========================
// OBTENER TRADUCCIÓN
// =========================

function t(clave) {
    if (Object.prototype.hasOwnProperty.call(traducciones[idiomaActual], clave)) {
        return traducciones[idiomaActual][clave];
    }

    if (Object.prototype.hasOwnProperty.call(traducciones.es, clave)) {
        return traducciones.es[clave];
    }

    return clave;
}


// =========================
// CAMBIAR IDIOMA
// =========================

function cambiarIdioma(nuevoIdioma) {
    if (nuevoIdioma !== "es" && nuevoIdioma !== "en") {
        return;
    }

    idiomaActual = nuevoIdioma;

    try {
        localStorage.setItem("idioma", nuevoIdioma);
    } catch (error) {
        console.warn("No se pudo guardar la preferencia de idioma.");
    }

    aplicarTraducciones();

    // Los módulos pueden escuchar este evento para traducir sus datos visibles.
    document.dispatchEvent(new CustomEvent("idiomaCambiado", {
        detail: { idioma: idiomaActual }
    }));
}


// =========================
// TRADUCIR ELEMENTOS DEL HTML
// =========================

function aplicarTraducciones() {
    document.documentElement.lang = idiomaActual;

    const elementos = document.querySelectorAll("[data-i18n]");

    elementos.forEach(function (elemento) {
        const clave = elemento.dataset.i18n;

        if (Object.prototype.hasOwnProperty.call(traducciones.es, clave) ||
            Object.prototype.hasOwnProperty.call(traducciones.en, clave)) {
            elemento.textContent = t(clave);
        }
    });

    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");

    placeholders.forEach(function (elemento) {
        const clave = elemento.dataset.i18nPlaceholder;

        if (Object.prototype.hasOwnProperty.call(traducciones.es, clave) ||
            Object.prototype.hasOwnProperty.call(traducciones.en, clave)) {
            elemento.placeholder = t(clave);
        }
    });

    const titulos = document.querySelectorAll("[data-i18n-title]");

    titulos.forEach(function (elemento) {
        const clave = elemento.dataset.i18nTitle;

        if (Object.prototype.hasOwnProperty.call(traducciones.es, clave) ||
            Object.prototype.hasOwnProperty.call(traducciones.en, clave)) {
            elemento.title = t(clave);
        }
    });

    const etiquetas = document.querySelectorAll("[data-i18n-aria-label]");

    etiquetas.forEach(function (elemento) {
        const clave = elemento.dataset.i18nAriaLabel;

        if (Object.prototype.hasOwnProperty.call(traducciones.es, clave) ||
            Object.prototype.hasOwnProperty.call(traducciones.en, clave)) {
            elemento.setAttribute("aria-label", t(clave));
        }
    });

    const botonesIdioma = document.querySelectorAll(
        ".language-button, .employee-language-switch button"
    );

    botonesIdioma.forEach(function (boton) {
        const activo = boton.textContent.trim().toLowerCase() === idiomaActual;

        boton.classList.toggle("idioma-activo", activo);
        boton.setAttribute("aria-pressed", String(activo));
    });
}


// =========================
// APLICAR IDIOMA AL CARGAR
// =========================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarTraducciones);
} else {
    aplicarTraducciones();
}
