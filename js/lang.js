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
    if (typeof traducirInterfaz === "function") traducirInterfaz();

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
    queueMicrotask(aplicarTraducciones);
}

// Textos de interfaz añadidos por los módulos recientes.
const textosInterfaz = {
    "Borrar": "Delete",
    "¿Borrar esta cuenta de usuario? El empleado se conservará.": "Delete this user account? The employee will be kept.",
    "No puedes borrar tu propia cuenta.": "You cannot delete your own account.",
    "Este usuario tiene historial asociado. Puedes desactivarlo.": "This user has associated history. You can deactivate them.",
    "Usuario eliminado.": "User deleted.",
    "Editar usuario": "Edit user",
    "Administrar usuarios": "Manage users",
    "Nombre de usuario": "Username",
    "Guardar cambios": "Save changes",
    "Deja la contraseña vacía para conservar la actual.": "Leave the password blank to keep the current one.",
    "Ese nombre de usuario ya existe.": "That username already exists.",
    "Usuario actualizado. Debe iniciar sesión nuevamente.": "User updated. They must sign in again.",
    "Mes": "Month",
    "Monto RD$": "Amount DOP",
    "Ingreso de empleado": "Employee form",
    "Ver empleado": "View employee",
    "Faltan tarifas por registrar.": "Some rates still need to be recorded.",
    "Dejar vacío si no cambia": "Leave blank if unchanged",
    "Empleado y cambios guardados correctamente.": "Employee and changes saved successfully.",
    "Empleado y tarifa inicial guardados correctamente.": "Employee and initial rate saved successfully.",
    "No se pudo cargar la nómina.": "Could not load the payroll.",
    "Usuario o correo electrónico": "Username or email",
    "Usuarios": "Users",
    "Usuario": "Username",
    "Crear usuario": "Create user",
    "Usuarios registrados": "Registered users",
    "Rol": "Role",
    "Cambiar contraseña": "Change password",
    "Guardar contraseña": "Save password",
    "Contraseña": "Password",
    "Contraseña actual": "Current password",
    "Nueva contraseña": "New password",
    "Confirmar contraseña": "Confirm password",
    "Confirmar nueva contraseña": "Confirm new password",
    "Foto de perfil": "Profile photo",
    "Imagen de perfil": "Profile image",
    "Cambiar imagen": "Change image",
    "Guardar foto": "Save photo",
    "Foto guardada.": "Photo saved.",
    "Inicial del usuario": "User initial",
    "JPG, PNG o WebP. Máximo 5 MB.": "JPG, PNG or WebP. Maximum 5 MB.",
    "Mi perfil": "My profile",
    "Iniciar sesión": "Sign in",
    "¿Olvidaste tu contraseña?": "Forgot your password?",
    "¿Desea cerrar sesión?": "Do you want to sign out?",
    "Activar": "Activate",
    "Desactivar": "Deactivate",
    "Acción": "Action",
    "Estado actualizado.": "Status updated.",
    "Usuario creado.": "User created.",
    "Total de empleados": "Total employees",
    "Empleados activos": "Active employees",
    "Nóminas en borrador": "Draft payrolls",
    "Empleados por estado": "Employees by status",
    "Resumen general": "Overview",
    "Resumen general de Wayvvy Payroll": "Wayvvy Payroll overview",
    "Sin estado": "No status",
    "No hay empleados registrados.": "No employees registered.",
    "No se pudieron cargar los empleados. Recarga la página para intentar de nuevo.": "Could not load employees. Reload the page to try again.",
    "+ Nueva nómina": "+ New payroll",
    "Nueva nómina": "New payroll",
    "Crear Nómina": "Create payroll",
    "Crear nómina": "Create payroll",
    "Crear borrador": "Create payroll",
    "Inicio de la semana (lunes)": "Week start (Monday)",
    "Fin de la semana (domingo)": "Week end (Sunday)",
    "El período se guardará en estado Borrador.": "The period will be saved as a draft.",
    "El pago se asigna al viernes siguiente a la semana trabajada. El año de la nómina corresponde a esa fecha de pago.": "Payment is scheduled for the Friday following the work week. The payroll year is based on that payment date.",
    "Corregir fecha de pago": "Correct payment date",
    "Consultar cálculo": "Calculate preview",
    "Resumen por empleado": "Employee summary",
    "Detalle por empleado": "Employee details",
    "Horas normales": "Regular hours",
    "Excedente semanal": "Weekly excess hours",
    "Importe excedente": "Excess hours pay",
    "Normal RD$": "Regular DOP",
    "Excedente RD$": "Excess DOP",
    "Bruto RD$": "Gross DOP",
    "AFP RD$": "AFP DOP",
    "SFS RD$": "SFS DOP",
    "ISR RD$": "ISR DOP",
    "Total RD$": "Total DOP",
    "Neto RD$": "Net DOP",
    "Descuentos del pago": "Payment deductions",
    "Acumulado mensual estimado": "Estimated monthly total",
    "Fecha de descuento": "Deduction date",
    "Descuentos acumulados": "Accrued deductions",
    "Resumen del período": "Period summary",
    "Neto del período": "Net for the period",
    "Saldo insuficiente": "Insufficient funds",
    "Pendiente": "Pending",
    "Pendiente: falta tarifa": "Pending: missing rate",
    "Sin calcular": "Not calculated",
    "Total bruto registrado": "Recorded gross total",
    "Deducciones registradas": "Recorded deductions",
    "Neto registrado": "Recorded net pay",
    "Los importes corresponden a los valores guardados. Una nómina en borrador puede tener cálculos pendientes.": "Amounts reflect saved values. A draft payroll may have pending calculations.",
    "Esta nómina todavía no tiene empleados registrados en su detalle.": "This payroll has no employee details yet.",
    "No hay horas registradas en este período.": "No hours recorded for this period.",
    "Sin incentivos registrados.": "No incentives recorded.",
    "Calculando...": "Calculating...",
    "Cargando empleados…": "Loading employees…",
    "Cargando nóminas...": "Loading payrolls...",
    "No hay nóminas registradas.": "No payrolls registered.",
    "Día / Day": "Day",
    "Domingo (libre)": "Sunday (off)",
    "Guardar horas": "Save hours",
    "Registro de horas trabajadas por empleado.": "Record hours worked by each employee.",
    "Horas y minutos guardados correctamente.": "Hours and minutes saved successfully.",
    "Hay horas sin guardar. ¿Desea descartarlas y cambiar la selección?": "There are unsaved hours. Discard them and change the selection?",
    "Historial de tarifas por hora": "Hourly rate history",
    "Tarifa por hora (RD$)": "Hourly rate (DOP)",
    "Tarifa vigente hoy (RD$ por hora)": "Current rate (DOP per hour)",
    "Nueva tarifa por hora (RD$)": "New hourly rate (DOP)",
    "Tarifa vigente desde": "Rate effective from",
    "Motivo del cambio de tarifa": "Reason for rate change",
    "Vigente desde": "Effective from",
    "RD$ por hora": "DOP per hour",
    "Motivo": "Reason",
    "Cada monto se aplica desde su fecha hasta el día anterior al siguiente cambio. Una fecha futura no cambia la tarifa de hoy.": "Each rate applies from its effective date until the day before the next change. A future date does not change today's rate.",
    "Seleccionar empleado": "Select employee",
    "Seleccione un empleado": "Select an employee",
    "Seleccione un empleado...": "Select an employee...",
    "Seleccione un período": "Select a period",
    "Seleccione un puesto...": "Select a position...",
    "Seleccione un estado...": "Select a status...",
    "Gestión de reportes": "Report management",
    "Reporte de horas": "Hours report",
    "Guardando…": "Saving…",
    "Contraseña actualizada.": "Password updated.",
    "Contraseña actualizada. El usuario debe iniciar sesión con la nueva clave.": "Password updated. The user must sign in with the new password.",
    "Contraseña cambiada. Inicie sesión nuevamente.": "Password changed. Sign in again.",
    "Las nuevas contraseñas no coinciden.": "The new passwords do not match.",
    "Las contraseñas no coinciden.": "The passwords do not match.",
    "La contraseña actual es incorrecta.": "The current password is incorrect.",
    "La contraseña actual no es correcta.": "The current password is incorrect.",
    "La contraseña debe tener entre 10 y 128 caracteres.": "The password must contain between 10 and 128 characters.",
    "La nueva contraseña debe ser diferente.": "The new password must be different.",
    "Usuario o contraseña incorrectos.": "Incorrect username or password.",
    "Complete usuario y contraseña.": "Enter a username and password.",
    "Contacte al administrador para recuperar su acceso.": "Contact the administrator to recover access.",
    "Inicie sesión para continuar.": "Sign in to continue.",
    "Intente iniciar sesión más tarde.": "Try signing in again later.",
    "Sesión cerrada.": "Signed out.",
    "La cuenta cambió. Inicie sesión nuevamente.": "The account has changed. Sign in again.",
    "Ese usuario ya existe.": "That username already exists.",
    "El usuario no existe.": "The user does not exist.",
    "Usuario inválido.": "Invalid user.",
    "Usuario o estado inválido.": "Invalid user or status.",
    "Seleccione un rol válido.": "Select a valid role.",
    "Use entre 3 y 50 letras, números, puntos, guiones o guiones bajos.": "Use 3 to 50 letters, numbers, dots, hyphens or underscores.",
    "No puede desactivar su propia cuenta.": "You cannot deactivate your own account.",
    "Debe conservar un administrador activo.": "At least one active administrator must remain.",
    "Su cuenta ya no tiene acceso.": "Your account no longer has access.",
    "Su rol no permite esta operación.": "Your role does not allow this operation.",
    "Acceso reservado al administrador.": "Administrator access required.",
    "El administrador gestiona los cambios de contraseña.": "Password changes are managed by the administrator.",
    "Origen no permitido.": "Origin not allowed.",
    "Seleccione una fecha de inicio válida.": "Select a valid start date.",
    "La semana de nómina debe comenzar un lunes.": "The payroll week must start on a Monday.",
    "El período debe terminar el domingo de la misma semana.": "The period must end on Sunday of the same week.",
    "El período guardado no corresponde a una semana completa de lunes a domingo.": "The saved period is not a full Monday-to-Sunday week.",
    "Este borrador no abarca una semana de lunes a domingo. Revise su período.": "This draft does not cover a Monday-to-Sunday week. Check the period.",
    "La fecha de pago excede el año permitido.": "The payment date exceeds the allowed year.",
    "Fecha de pago corregida.": "Payment date corrected.",
    "Corrija el período o la fecha de pago de esta nómina.": "Correct this payroll's period or payment date.",
    "Solo se puede corregir la fecha de una nómina en borrador.": "Only a draft payroll's date can be corrected.",
    "Esta vista previa está disponible solo para nóminas en borrador.": "This preview is available only for draft payrolls.",
    "La nómina no existe.": "The payroll does not exist.",
    "El identificador de nómina no es válido.": "Invalid payroll ID.",
    "No se pudo crear la nómina.": "Could not create the payroll.",
    "No se pudo consultar la nómina.": "Could not retrieve the payroll.",
    "No se pudo corregir la fecha de pago.": "Could not correct the payment date.",
    "No se pudo corregir la fecha.": "Could not correct the date.",
    "No se pudo consultar el cálculo.": "Could not retrieve the calculation.",
    "No se pudo calcular el comprobante.": "Could not calculate the statement.",
    "No se pudo calcular el período. Revise los minutos y las tarifas históricas.": "Could not calculate the period. Check recorded minutes and historical rates.",
    "No se pudo calcular el tiempo regular. Revise las tarifas y los minutos registrados.": "Could not calculate regular time. Check rates and recorded minutes.",
    "No se pudo generar el resumen.": "Could not generate the summary.",
    "El servidor no devolvió un cálculo válido.": "The server did not return a valid calculation.",
    "El servidor no devolvió una respuesta válida.": "The server did not return a valid response.",
    "El servidor no devolvió una respuesta válida. Compruebe que está actualizado.": "The server did not return a valid response. Check that it is up to date.",
    "La respuesta del servidor no es válida.": "The server response is invalid.",
    "Respuesta de empleados inválida.": "Invalid employee response.",
    "La lista de empleados no es válida.": "The employee list is invalid.",
    "El empleado no existe.": "The employee does not exist.",
    "El empleado seleccionado no existe.": "The selected employee does not exist.",
    "Empleado no encontrado.": "Employee not found.",
    "Empleado inválido.": "Invalid employee.",
    "Empleado o fecha inválidos.": "Invalid employee or date.",
    "Empleado o fechas inválidos.": "Invalid employee or dates.",
    "Seleccione un empleado válido.": "Select a valid employee.",
    "No se indicó ningún empleado.": "No employee specified.",
    "No se recibieron los datos del empleado.": "No employee data received.",
    "Complete el nombre.": "Enter the first name.",
    "Complete el apellido.": "Enter the last name.",
    "Revise la fecha de nacimiento.": "Check the date of birth.",
    "Seleccione una fecha de ingreso válida.": "Select a valid employment start date.",
    "La fecha de ingreso no es válida.": "The employment start date is invalid.",
    "Seleccione un estado válido para el empleado.": "Select a valid employee status.",
    "La cédula nueva debe contener exactamente 11 dígitos.": "The new national ID must contain exactly 11 digits.",
    "La cédula nueva debe contener 11 dígitos; puede escribirla con guiones.": "The new national ID must contain 11 digits; hyphens are allowed.",
    "La tarifa por hora debe ser mayor que cero.": "The hourly rate must be greater than zero.",
    "La tarifa debe ser mayor que cero.": "The rate must be greater than zero.",
    "La tarifa debe tener como máximo dos decimales.": "The rate must have at most two decimal places.",
    "Tarifa inválida en el historial.": "Invalid historical rate.",
    "La nueva tarifa debe ser distinta de la última registrada.": "The new rate must differ from the last recorded rate.",
    "La nueva vigencia debe ser posterior a la última tarifa registrada.": "The new effective date must follow the last recorded rate.",
    "La tarifa no puede comenzar antes del ingreso ni antes del 25 de agosto de 2026.": "The rate cannot begin before employment or before August 25, 2026.",
    "La fecha de ingreso no puede quedar después de una tarifa ya registrada.": "Employment cannot start after an already recorded rate.",
    "La fecha afectaría una nómina procesada o pagada. Elija una fecha posterior.": "This date would affect processed or paid payroll. Choose a later date.",
    "Indique un motivo de entre 1 y 255 caracteres.": "Enter a reason of 1 to 255 characters.",
    "El historial cambió mientras editabas. Recarga el empleado antes de guardar.": "The history changed while you were editing. Reload the employee before saving.",
    "Empleado actualizado. El historial anterior se conservó.": "Employee updated. Previous history was preserved.",
    "No hay tarifa confirmada para esa fecha.": "No confirmed rate exists for that date.",
    "Falta inicializar el historial de este empleado.": "This employee's history must be initialized.",
    "Falta inicializar el historial de tarifas de este empleado.": "This employee's rate history must be initialized.",
    "Falta una tarifa histórica para el acumulado mensual.": "A historical rate is missing for the monthly total.",
    "Falta una tarifa histórica para el período.": "A historical rate is missing for the period.",
    "No se pudo consultar el historial de tarifas.": "Could not retrieve the rate history.",
    "No se pudo guardar. No se aplicaron los cambios.": "Could not save. No changes were applied.",
    "No tiene permiso para editar empleados.": "You do not have permission to edit employees.",
    "Complete las horas y los minutos con números enteros válidos.": "Enter valid whole numbers for hours and minutes.",
    "Máximo diario superado.": "Daily maximum exceeded.",
    "El domingo es un día libre.": "Sunday is a day off.",
    "El rango solo contiene un domingo libre.": "The range contains only a Sunday off.",
    "El rango no puede superar 31 días.": "The range cannot exceed 31 days.",
    "Seleccione un rango de 1 a 31 días, con la fecha final igual o posterior a la inicial.": "Select a range of 1 to 31 days with the end date on or after the start date.",
    "Seleccione un rango de hasta un año.": "Select a range of up to one year.",
    "Debe enviar entre 1 y 31 días.": "You must submit between 1 and 31 days.",
    "Las fechas deben ser válidas y no repetirse.": "Dates must be valid and unique.",
    "Use minutos enteros no negativos, con un máximo de 24 horas por día.": "Use non-negative whole minutes, up to 24 hours per day.",
    "La asistencia recibida no es válida.": "The attendance data is invalid.",
    "Asistencia duplicada para un empleado y fecha.": "Duplicate attendance for an employee and date.",
    "Fecha de asistencia inválida.": "Invalid attendance date.",
    "Fecha de consulta inválida.": "Invalid query date.",
    "Período inválido.": "Invalid period.",
    "No se pudieron guardar las horas y minutos.": "Could not save hours and minutes.",
    "No se pudo cargar la asistencia.": "Could not load attendance.",
    "El monto debe ser mayor que cero": "The amount must be greater than zero",
    "Incentivo duplicado en la consulta.": "Duplicate incentive in the query.",
    "No se pudo cerrar la sesión. Intente nuevamente.": "Could not sign out. Try again.",
    "No se pudo completar la operación de usuarios.": "Could not complete the user operation.",
    "No se pudo completar la operación.": "Could not complete the operation.",
    "No se pudieron cargar los datos del empleado.": "Could not load employee data.",
    "No se pudieron cargar los empleados.": "Could not load employees.",
    "No se pudieron cargar los empleados": "Could not load employees",
    "No se pudo cargar el empleado": "Could not load the employee",
    "No se pudieron cargar las nóminas.": "Could not load payrolls.",
    "No se pudieron cargar las nóminas": "Could not load payrolls",
    "No se pudieron cargar los incentivos": "Could not load incentives",
    "No se pudo generar el reporte": "Could not generate the report",
    "Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.": "Select a JPG, PNG or WebP image up to 5 MB.",
    "La imagen es demasiado compleja. Selecciona otra.": "The image is too complex. Select another one.",
    "La imagen no es válida o es demasiado grande.": "The image is invalid or too large.",
    "El formato de la imagen no es válido.": "The image format is invalid.",
    "Actualice el servidor de nómina.": "Update the payroll server.",
    "Falta actualizar el servidor con el resumen de incentivos.": "Update the server to include the incentive summary.",
    "Falta actualizar el servidor con la clasificación de 40 horas semanales.": "Update the server to include the 40-hour weekly classification.",
    "Falta actualizar el servidor o migrar los minutos de asistencia.": "Update the server or migrate attendance minutes.",
    "Falta actualizar el servidor para separar los incentivos.": "Update the server to separate incentives.",
    "Falta preparar los roles en la base de datos.": "Database roles must be initialized.",
    "Lunes": "Monday",
    "Martes": "Tuesday",
    "Miércoles": "Wednesday",
    "Jueves": "Thursday",
    "Viernes": "Friday",
    "Sábado": "Saturday",
    "Domingo": "Sunday",
    "Masculino": "Male",
    "Femenino": "Female",
    "Borrador": "Draft",
    "Pagada": "Paid",
    "Procesada": "Processed",
    "Activo": "Active",
    "Inactivo": "Inactive",
    "Licencia": "Leave",
    "Vacaciones": "Vacation",
    "Suspendido": "Suspended"
};

// Complemento para etiquetas, tablas y mensajes creados después de cargar la página.
// Los datos de usuarios y los valores de formularios no se traducen.
const paresInterfaz = new Map();
Object.keys(traducciones.es).forEach(clave => {
    const es=traducciones.es[clave], en=traducciones.en[clave];
    if(typeof es==='string' && typeof en==='string') paresInterfaz.set(es,en);
});
Object.entries(textosInterfaz).forEach(([es,en])=>paresInterfaz.set(es,en));
const originalesInterfaz = new Map([...paresInterfaz].map(([es,en])=>[en,es]));
const memoriaTextos = new WeakMap();
const memoriaAtributos = new WeakMap();
const validacionesIdioma = new Map();
let observadorIdioma;
const tituloPaginaOriginal=document.title;

function traducirTexto(texto) {
    const original=String(texto ?? '');
    const limpio=original.trim().replace(/\s+/g,' ');
    const es=paresInterfaz.has(limpio)?limpio:(originalesInterfaz.get(limpio)||limpio);
    let resultado=idiomaActual==='en'?(paresInterfaz.get(es)||es):es;
    // Sólo prefijos del programa; el contenido variable se conserva intacto.
    const prefijos=[['Contraseña de ','Password for '],['Total normal: ','Regular total: '],
        ['Total de incentivos: ','Total incentives: '],['Nómina ','Payroll '],
        ['Horas regulares: ','Regular hours: '],['Horas extras: ','Additional hours: '],['Total de horas: ','Total hours: '],
        ['Falta configurar las tasas y los topes para el mes ','Rates and caps are not configured for month ']];
    if(resultado===es && !paresInterfaz.has(es)) {
        for(const [a,b] of prefijos){
            if(limpio.startsWith(a)||limpio.startsWith(b)){
                const prefijo=limpio.startsWith(a)?a:b;
                resultado=(idiomaActual==='en'?b:a)+limpio.slice(prefijo.length);break;
            }
        }
        const cantidad=limpio.match(/^(\d+) (empleados registrados|registered employees)$/);
        if(cantidad)resultado=cantidad[1]+(idiomaActual==='en'?' registered employees':' empleados registrados');
        const patrones=[
            [/^La fecha de pago que corresponde a esta semana es (.+)\.$/,/^The payment date for this week is (.+)\.$/,'La fecha de pago que corresponde a esta semana es $1.','The payment date for this week is $1.'],
            [/^Corregir pago al (.+)$/, /^Correct payment to (.+)$/,'Corregir pago al $1','Correct payment to $1'],
            [/^El (\d{4}-\d{2}-\d{2}) supera 24 horas\.$/,/^The date (\d{4}-\d{2}-\d{2}) exceeds 24 hours\.$/,'El $1 supera 24 horas.','The date $1 exceeds 24 hours.'],
            [/^Horas regulares, (.+)$/, /^Regular hours, (.+)$/,'Horas regulares, $1','Regular hours, $1'],
            [/^Horas extras, (.+)$/, /^Additional hours, (.+)$/,'Horas extras, $1','Additional hours, $1'],
            [/^Minutos regulares, (.+)$/, /^Regular minutes, (.+)$/,'Minutos regulares, $1','Regular minutes, $1'],
            [/^Minutos extras, (.+)$/, /^Additional minutes, (.+)$/,'Minutos extras, $1','Additional minutes, $1']
        ];
        for(const [a,b,es,en] of patrones){const patron=a.test(limpio)?a:b.test(limpio)?b:null;if(patron){resultado=limpio.replace(patron,idiomaActual==='en'?en:es);break;}}
    }
    if(resultado===limpio)return original;
    return original.slice(0,original.length-original.trimStart().length)+resultado+original.slice(original.trimEnd().length);
}

function validarEnIdioma(campo,mensaje) {
    validacionesIdioma.set(campo,String(mensaje));
    campo.setCustomValidity(traducirTexto(mensaje));
}

function esDatoPersonal(elemento) {
    return elemento.closest(`script,style,textarea,[data-no-i18n],.profile-button,
        #nombre_completo,#cedula,#telefono,#correo,#direccion,#puesto,
        #usuariosBody td:first-child,#puestosBody td:nth-child(2),#puestosBody td:nth-child(3),
        #empleadosBody td:nth-child(2),#empleadosBody td:nth-child(4),
        #tarifasBody td:nth-child(3),.comprobante-empleado h3,.comprobante-empleado strong,
        #calculoRegularBody td:first-child:not([colspan]),#detalleNominaBody td:first-child:not([colspan]),
        #incentivosAparteBody td:first-child,#descuentosBody td:first-child,#acumuladosBody td:nth-child(2),
        #listaIncentivos td:nth-child(2),#reporteResultados tbody td:nth-child(2)`);
}

function traducirInterfaz() {
    if(!document.body)return;
    observadorIdioma?.disconnect();
    const partesTitulo=tituloPaginaOriginal.split(' - ');
    document.title=partesTitulo.map(parte=>traducirTexto(parte)).join(' - ');
    const recorrer=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(recorrer.nextNode()) {
        const nodo=recorrer.currentNode, elemento=nodo.parentElement;
        if(!elemento || esDatoPersonal(elemento))continue;
        // Las opciones de empleados y puestos son datos escritos por el administrador.
        if(elemento.tagName==='OPTION'){
            if(elemento.value && ['empleadoUsuario','empleadoAsistencia','empleadoReporte','empleadoIncentivo','id_puesto'].includes(elemento.parentElement.id))continue;
            if(!elemento.hasAttribute('value'))elemento.value=elemento.value;
        }
        let previo=memoriaTextos.get(nodo);
        if(!previo || nodo.nodeValue!==previo.salida)previo={original:nodo.nodeValue};
        const salida=traducirTexto(previo.original);
        if(nodo.nodeValue!==salida)nodo.nodeValue=salida;
        memoriaTextos.set(nodo,{original:previo.original,salida});
    }
    document.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(el=>{
        if(esDatoPersonal(el))return;
        const historial=memoriaAtributos.get(el)||{};
        for(const nombre of ['placeholder','title','aria-label','alt']){
            if(!el.hasAttribute(nombre))continue;
            const valor=el.getAttribute(nombre), previo=historial[nombre];
            const original=previo && previo.salida===valor?previo.original:valor;
            const salida=traducirTexto(original);
            if(valor!==salida)el.setAttribute(nombre,salida);
            historial[nombre]={original,salida};
        }
        memoriaAtributos.set(el,historial);
    });
    for(const [campo,mensaje] of validacionesIdioma) {
        if(campo.isConnected)campo.setCustomValidity(traducirTexto(mensaje));
        else validacionesIdioma.delete(campo);
    }
    observadorIdioma?.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt']});
}

// Los cuadros nativos reciben la traducción antes de abrirse.
const avisoOriginal=window.alert.bind(window), confirmarOriginal=window.confirm.bind(window);
window.alert=mensaje=>avisoOriginal(traducirTexto(mensaje));
window.confirm=mensaje=>confirmarOriginal(traducirTexto(mensaje));
function iniciarTraduccionDinamica(){
    observadorIdioma=new MutationObserver(traducirInterfaz);
    traducirInterfaz();
}
document.addEventListener('idiomaCambiado',traducirInterfaz);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciarTraduccionDinamica);
else iniciarTraduccionDinamica();
