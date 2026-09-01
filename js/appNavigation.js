const contenidoPrincipal =
    document.getElementById("contenidoPrincipal");

const opcionesMenu =
    document.querySelectorAll(
        ".sidebar a[data-page]"
    );


// =====================================================
// FUNCIONES GENERALES
// =====================================================

function formatearFechaUSADesdeMysql(valorFecha) {

    if (!valorFecha) {
        return "";
    }

    const fechaMysql =
        valorFecha.split("T")[0];

    const partes =
        fechaMysql.split("-");

    return `${partes[1]}/${partes[2]}/${partes[0]}`;
}


function formatearFechaUSA(fecha) {

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    const anio =
        fecha.getFullYear();

    return `${mes}/${dia}/${anio}`;
}


function fechaParaInput(fecha) {

    return [
        fecha.getFullYear(),

        String(
            fecha.getMonth() + 1
        ).padStart(2, "0"),

        String(
            fecha.getDate()
        ).padStart(2, "0")

    ].join("-");
}


// =====================================================
// CARGAR EMPLEADOS
// =====================================================

async function cargarEmpleados() {

    contenidoPrincipal.innerHTML = `

        <div class="employees-header">

            <div>
                <h1>${t("empleados")}</h1>
                <p>${t("gestionEmpleados")}</p>
            </div>

            <a
                href="/ingresoDeEmpleado.html"
                class="btn-new-employee"
            >
                <span class="plus-icon">+</span>
                <span>${t("nuevoEmpleado")}</span>
            </a>

        </div>


        <div class="employees-table-container">

            <table class="employees-table">

                <thead>

                    <tr>
                        <th>${t("numero")}</th>
                        <th>${t("empleado")}</th>
                        <th>${t("cedula")}</th>
                        <th>${t("puesto")}</th>
                        <th>${t("fechaIngreso")}</th>
                        <th>${t("estado")}</th>
                        <th>${t("acciones")}</th>
                    </tr>

                </thead>

                <tbody id="empleadosBody"></tbody>

            </table>

        </div>
    `;


    const empleadosBody =
        document.getElementById(
            "empleadosBody"
        );


    try {

        const response =
            await fetch(
                "/api/empleados"
            );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los empleados"
            );

        }


        const empleados =
            await response.json();


        empleados.forEach(
            function(empleado) {

                const fecha =
                    formatearFechaUSADesdeMysql(
                        empleado.fecha_ingreso
                    );


                // =====================================
                // ESTADO Y COLOR
                // =====================================

                const estadoBase =
                    (empleado.estado || "")
                        .trim()
                        .toLowerCase();


                let claseEstado = "";


                if (estadoBase === "activo") {

                    claseEstado =
                        "active-status";

                }
                else if (
                    estadoBase === "inactivo"
                ) {

                    claseEstado =
                        "inactive-status";

                }
                else if (
                    estadoBase === "suspendido"
                ) {

                    claseEstado =
                        "suspended-status";

                }
                else if (
                    estadoBase === "licencia"
                ) {

                    claseEstado =
                        "license-status";

                }
                else if (
                    estadoBase === "vacaciones"
                ) {

                    claseEstado =
                        "vacation-status";

                }


                const estadoTraducido =
                    estadoBase
                        ? t(estadoBase)
                        : t("sinEstado");


                // =====================================
                // CREAR FILA
                // =====================================

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${empleado.numero_empleado || "-"}
                    </td>

                    <td>
                        ${empleado.nombres || ""}
                        ${empleado.apellidos || ""}
                    </td>

                    <td>
                        ${empleado.cedula || "-"}
                    </td>

                    <td>
                        ${empleado.puesto || t("sinPuesto")}
                    </td>

                    <td>
                        ${fecha || "-"}
                    </td>

                    <td>

                        <span
                            class="status ${claseEstado}"
                        >
                            ${estadoTraducido}
                        </span>

                    </td>

                    <td class="acciones-empleado">

                        <button
                            class="action-button view-button"
                            type="button"
                        >
                            ${t("ver")}
                        </button>

                        <button
                            class="edit-button"
                            type="button"
                            title="${t("editarEmpleado")}"
                        >
                            ✎
                        </button>

                    </td>
                `;


                // =====================================
                // VER
                // =====================================

                const botonVer =
                    fila.querySelector(
                        ".view-button"
                    );


                botonVer.addEventListener(
                    "click",
                    function() {

                        cargarVerEmpleado(
                            empleado.id_empleado
                        );

                    }
                );


                // =====================================
                // EDITAR
                // =====================================

                const botonEditar =
                    fila.querySelector(
                        ".edit-button"
                    );


                botonEditar.addEventListener(
                    "click",
                    function() {

                        window.location.href =
                            `/ingresoDeEmpleado.html?id=${empleado.id_empleado}`;

                    }
                );


                empleadosBody.appendChild(
                    fila
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Error al cargar empleados:",
            error
        );


        empleadosBody.innerHTML = `

            <tr>

                <td colspan="7">
                    No se pudieron cargar los empleados.
                </td>

            </tr>
        `;

    }

}


// =====================================================
// VER EMPLEADO
// =====================================================

async function cargarVerEmpleado(
    idEmpleado
) {

    contenidoPrincipal.innerHTML = `

        <div class="employee-view-card">

            <div class="employee-view-header">

                <div>

                    <h1>
                        ${t("detalleEmpleado")}
                    </h1>

                    <p>
                        ${t("infoEmpleado")}
                    </p>

                </div>


                <button
                    type="button"
                    class="btn-volver"
                    id="btnVolverEmpleados"
                >
                    ${t("volver")}
                </button>

            </div>


            <div
                class="employee-info-grid"
                id="employeeInfoGrid"
            >
                ${t("cargandoInfo")}
            </div>

        </div>
    `;


    const employeeInfoGrid =
        document.getElementById(
            "employeeInfoGrid"
        );


    try {

        const response =
            await fetch(
                `/api/empleados/${idEmpleado}`
            );


        if (!response.ok) {

            throw new Error(
                "No se pudo cargar el empleado"
            );

        }


        const empleado =
            await response.json();


        const estadoDetalle =
            (empleado.estado || "")
                .trim()
                .toLowerCase();


        const estadoDetalleTraducido =
            estadoDetalle
                ? t(estadoDetalle)
                : t("sinEstado");


        const fechaNacimiento =
            formatearFechaUSADesdeMysql(
                empleado.fecha_nacimiento
            );


        const fechaIngreso =
            formatearFechaUSADesdeMysql(
                empleado.fecha_ingreso
            );


        const salario =
            Number(
                empleado.salario_base || 0
            ).toLocaleString(
                idiomaActual === "en"
                    ? "en-US"
                    : "es-DO",
                {
                    style: "currency",
                    currency: "DOP"
                }
            );


        employeeInfoGrid.innerHTML = `

            <div class="info-item">

                <span class="info-label">
                    ${t("numeroEmpleado")}
                </span>

                <span class="info-value">
                    ${empleado.numero_empleado || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("nombreCompleto")}
                </span>

                <span class="info-value">
                    ${empleado.nombres || ""}
                    ${empleado.apellidos || ""}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("cedula")}
                </span>

                <span class="info-value">
                    ${empleado.cedula || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("sexo")}
                </span>

                <span class="info-value">
                    ${empleado.sexo || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("fechaNacimiento")}
                </span>

                <span class="info-value">
                    ${fechaNacimiento || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("telefono")}
                </span>

                <span class="info-value">
                    ${empleado.telefono || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("correo")}
                </span>

                <span class="info-value">
                    ${empleado.correo || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("direccion")}
                </span>

                <span class="info-value">
                    ${empleado.direccion || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("puesto")}
                </span>

                <span class="info-value">
                    ${empleado.puesto || t("sinPuesto")}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("fechaIngreso")}
                </span>

                <span class="info-value">
                    ${fechaIngreso || "-"}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("salarioBase")}
                </span>

                <span class="info-value">
                    ${salario}
                </span>

            </div>


            <div class="info-item">

                <span class="info-label">
                    ${t("estado")}
                </span>

                <span class="info-value">
                    ${estadoDetalleTraducido}
                </span>

            </div>
        `;


    }
    catch (error) {

        console.error(
            "Error al cargar empleado:",
            error
        );


        employeeInfoGrid.innerHTML = `

            <p>
                No se pudo cargar la información
                del empleado.
            </p>
        `;

    }


    const btnVolverEmpleados =
        document.getElementById(
            "btnVolverEmpleados"
        );


    btnVolverEmpleados.addEventListener(
        "click",
        function() {

            cargarEmpleados();

        }
    );

}


// =====================================================
// CARGAR PUESTOS
// =====================================================

async function cargarModuloPuestos() {

    contenidoPrincipal.innerHTML = `

        <div class="puestos-header">

            <div>

                <h1>
                    ${t("puestos")}
                </h1>

                <p>
                    ${t("administracionPuestos")}
                </p>

            </div>

        </div>


        <section class="puesto-form-card">

            <h2>
                ${t("nuevoPuesto")}
            </h2>


            <form id="puestoForm">

                <div class="form-group">

                    <label for="nombre_puesto">
                        ${t("nombrePuesto")}
                    </label>

                    <input
                        type="text"
                        id="nombre_puesto"
                        name="nombre_puesto"
                        required
                    >

                </div>


                <div class="form-group">

                    <label for="descripcion">
                        ${t("descripcion")}
                    </label>

                    <textarea
                        id="descripcion"
                        name="descripcion"
                        rows="4"
                        required
                    ></textarea>

                </div>


                <button
                    type="submit"
                    class="btn-guardar"
                >
                    ${t("guardarPuesto")}
                </button>


                <button
                    type="button"
                    class="btn-cancelar-edicion"
                    id="btnCancelarEdicion"
                    style="display: none;"
                >
                    ${t("cancelarEdicion")}
                </button>

            </form>

        </section>


        <section class="puestos-lista-card">

            <div class="puestos-lista-header">

                <h2>
                    ${t("puestosRegistrados")}
                </h2>

            </div>


            <div class="puestos-table-container">

                <table class="puestos-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>${t("puesto")}</th>
                            <th>${t("descripcion")}</th>
                            <th>${t("acciones")}</th>
                        </tr>

                    </thead>


                    <tbody id="puestosBody">

                        <tr>

                            <td colspan="4">
                                ${t("cargandoPuestos")}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>
    `;


    const puestoForm =
        document.getElementById(
            "puestoForm"
        );

    const btnCancelarEdicion =
        document.getElementById(
            "btnCancelarEdicion"
        );

    const puestosBody =
        document.getElementById(
            "puestosBody"
        );


    // =================================================
    // CARGAR PUESTOS
    // =================================================

    try {

        const responsePuestos =
            await fetch(
                "/api/puestos"
            );


        if (!responsePuestos.ok) {

            throw new Error(
                "No se pudieron cargar los puestos"
            );

        }


        const puestos =
            await responsePuestos.json();


        puestosBody.innerHTML = "";


        puestos.forEach(
            function(puesto) {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${puesto.id_puesto}
                    </td>

                    <td>
                        ${puesto.nombre_puesto}
                    </td>

                    <td>
                        ${puesto.descripcion || t("sinDescripcion")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-button editar-puesto"
                            title="${t("editarPuesto")}"
                        >
                            ✎
                        </button>

                    </td>
                `;


                const botonEditarPuesto =
                    fila.querySelector(
                        ".editar-puesto"
                    );


                botonEditarPuesto.addEventListener(
                    "click",
                    function() {

                        document
                            .getElementById(
                                "nombre_puesto"
                            )
                            .value =
                            puesto.nombre_puesto || "";


                        document
                            .getElementById(
                                "descripcion"
                            )
                            .value =
                            puesto.descripcion || "";


                        puestoForm.dataset.idPuesto =
                            puesto.id_puesto;


                        const botonGuardar =
                            puestoForm.querySelector(
                                ".btn-guardar"
                            );


                        botonGuardar.textContent =
                            t("guardarCambios");


                        btnCancelarEdicion.style.display =
                            "inline-block";

                    }
                );


                puestosBody.appendChild(
                    fila
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Error al cargar puestos:",
            error
        );


        puestosBody.innerHTML = `

            <tr>

                <td colspan="4">
                    No se pudieron cargar los puestos.
                </td>

            </tr>
        `;

    }


    // =================================================
    // CANCELAR EDICIÓN
    // =================================================

    btnCancelarEdicion.addEventListener(
        "click",
        function() {

            puestoForm.reset();

            delete puestoForm.dataset.idPuesto;


            const botonGuardar =
                puestoForm.querySelector(
                    ".btn-guardar"
                );


            botonGuardar.textContent =
                t("guardarPuesto");


            btnCancelarEdicion.style.display =
                "none";

        }
    );


    // =================================================
    // GUARDAR / EDITAR
    // =================================================

    puestoForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const idPuesto =
                puestoForm.dataset.idPuesto;


            const datosPuesto = {

                nombre_puesto:
                    document
                        .getElementById(
                            "nombre_puesto"
                        )
                        .value
                        .trim(),

                descripcion:
                    document
                        .getElementById(
                            "descripcion"
                        )
                        .value
                        .trim(),

                id_departamento: null

            };


            try {

                let response;


                if (idPuesto) {

                    const confirmar =
                        confirm(
                            t("confirmarCambios")
                        );


                    if (!confirmar) {
                        return;
                    }


                    response =
                        await fetch(
                            `/api/puestos/${idPuesto}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        datosPuesto
                                    )
                            }
                        );

                }
                else {

                    response =
                        await fetch(
                            "/api/puestos",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        datosPuesto
                                    )
                            }
                        );

                }


                const resultado =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        resultado.error ||
                        t("errorGuardarPuesto")
                    );

                }


                alert(
                    resultado.mensaje
                );


                puestoForm.reset();

                delete puestoForm.dataset.idPuesto;


                await cargarModuloPuestos();


            }
            catch (error) {

                console.error(
                    "Error al guardar puesto:",
                    error
                );


                alert(
                    t("errorGeneralPuesto")
                );

            }

        }
    );

}


// =====================================================
// ASISTENCIA / HORAS TRABAJADAS
// =====================================================

async function cargarModuloAsistencia() {

    contenidoPrincipal.innerHTML = `

        <div class="asistencia-header">

            <div>

                <h1>
                    ${t("asistencia")}
                </h1>

                <p>
                    ${t("gestionAsistencia")}
                </p>

            </div>

        </div>


        <section class="asistencia-card">


            <div class="attendance-top-section">


                <div class="attendance-employee-box">

                    <label for="empleadoAsistencia">
                        ${t("empleadoAsistencia")}
                    </label>

                    <select id="empleadoAsistencia">

                        <option value="">
                            ${t("seleccionarEmpleado")}
                        </option>

                    </select>

                </div>


                <div class="attendance-dates-box">

                    <div class="attendance-date-fields">


                        <div class="form-group compact-date-group">

                            <label for="semanaAsistencia">
                                ${t("desde")}
                            </label>

                            <input
                                type="date"
                                id="semanaAsistencia"
                            >

                        </div>


                        <div class="form-group compact-date-group">

                            <label for="fechaHastaAsistencia">
                                ${t("hasta")}
                            </label>

                            <input
                                type="date"
                                id="fechaHastaAsistencia"
                            >

                        </div>


                    </div>


                    <div class="attendance-range-center">

                        <small id="rangoSemana"></small>

                    </div>

                </div>


            </div>


            <div class="asistencia-table-container">

                <table class="asistencia-table">

                    <thead>

                        <tr>
                            <th>Día / Day</th>
                            <th>Fecha / Date</th>
                            <th>${t("horasRegulares")}</th>
                            <th>${t("horasExtras")}</th>
                        </tr>

                    </thead>


                    <tbody id="asistenciaBody">
                    </tbody>

                </table>

            </div>


            <div class="asistencia-totales">

                <p>
                    ${t("horasRegulares")}:
                    <strong id="totalRegulares">
                        0.00
                    </strong>
                </p>

                <p>
                    ${t("horasExtras")}:
                    <strong id="totalExtras">
                        0.00
                    </strong>
                </p>

                <p>
                    ${t("totalHoras")}:
                    <strong id="totalHoras">
                        0.00
                    </strong>
                </p>

            </div>


            <button
                type="button"
                class="btn-guardar"
                id="btnGuardarHoras"
            >
                ${t("guardarHoras")}
            </button>

        </section>
    `;


    // =================================================
    // ELEMENTOS
    // =================================================

    const selectEmpleado =
        document.getElementById(
            "empleadoAsistencia"
        );

    const inputSemana =
        document.getElementById(
            "semanaAsistencia"
        );

    const inputHasta =
        document.getElementById(
            "fechaHastaAsistencia"
        );

    const asistenciaBody =
        document.getElementById(
            "asistenciaBody"
        );

    const rangoSemana =
        document.getElementById(
            "rangoSemana"
        );

    const btnGuardarHoras =
        document.getElementById(
            "btnGuardarHoras"
        );


    // =================================================
    // CALCULAR TOTALES
    // =================================================

    function calcularTotales() {

        let regulares = 0;
        let extras = 0;


        const camposRegulares =
            document.querySelectorAll(
                ".horas-regulares"
            );

        const camposExtras =
            document.querySelectorAll(
                ".horas-extras"
            );


        camposRegulares.forEach(
            function(campo) {

                regulares +=
                    Number(
                        campo.value
                    ) || 0;

            }
        );


        camposExtras.forEach(
            function(campo) {

                extras +=
                    Number(
                        campo.value
                    ) || 0;

            }
        );


        document
            .getElementById(
                "totalRegulares"
            )
            .textContent =
            regulares.toFixed(2);


        document
            .getElementById(
                "totalExtras"
            )
            .textContent =
            extras.toFixed(2);


        document
            .getElementById(
                "totalHoras"
            )
            .textContent =
            (
                regulares +
                extras
            ).toFixed(2);

    }


    // =================================================
    // GENERAR FILAS SEGÚN RANGO
    // =================================================

    function generarFilasAsistencia() {

        asistenciaBody.innerHTML = "";

        calcularTotales();


        if (
            !inputSemana.value ||
            !inputHasta.value
        ) {

            rangoSemana.textContent = "";
            return;

        }


        const partesInicio =
            inputSemana.value.split("-");

        const partesFin =
            inputHasta.value.split("-");


        const fechaInicio =
            new Date(
                Number(partesInicio[0]),
                Number(partesInicio[1]) - 1,
                Number(partesInicio[2])
            );


        const fechaFin =
            new Date(
                Number(partesFin[0]),
                Number(partesFin[1]) - 1,
                Number(partesFin[2])
            );


        if (fechaFin < fechaInicio) {

            rangoSemana.textContent = "";

            alert(
                t("rangoFechaInvalido")
            );

            return;

        }


        const diferenciaDias =
            Math.floor(
                (
                    fechaFin -
                    fechaInicio
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) + 1;


        if (diferenciaDias > 31) {

            rangoSemana.textContent = "";

            alert(
                t("rangoDemasiadoGrande")
            );

            return;

        }


        const clavesDias = [

            "domingo",
            "lunes",
            "martes",
            "miercoles",
            "jueves",
            "viernes",
            "sabado"

        ];


        for (
            let i = 0;
            i < diferenciaDias;
            i++
        ) {

            const fechaDia =
                new Date(
                    fechaInicio
                );


            fechaDia.setDate(
                fechaInicio.getDate() + i
            );


            const fechaMysql =
                fechaParaInput(
                    fechaDia
                );


            const claveDia =
                clavesDias[
                    fechaDia.getDay()
                ];


            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    ${t(claveDia)}
                </td>

                <td
                    class="fecha-asistencia"
                    data-fecha="${fechaMysql}"
                    data-offset="${i}"
                >
                    ${formatearFechaUSA(fechaDia)}
                </td>

                <td>

                    <input
                        type="number"
                        class="horas-regulares"
                        data-offset="${i}"
                        min="0"
                        step="0.25"
                        value="0"
                    >

                </td>

                <td>

                    <input
                        type="number"
                        class="horas-extras"
                        data-offset="${i}"
                        min="0"
                        step="0.25"
                        value="0"
                    >

                </td>
            `;


            asistenciaBody.appendChild(
                fila
            );

        }


        rangoSemana.textContent =
            `${formatearFechaUSA(fechaInicio)} - ${formatearFechaUSA(fechaFin)}`;


        calcularTotales();

    }


    // =================================================
    // CARGAR HORAS GUARDADAS
    // =================================================

    async function cargarHorasGuardadas() {

        const idEmpleado =
            selectEmpleado.value;

        const fechaInicio =
            inputSemana.value;

        const fechaFin =
            inputHasta.value;


        document
            .querySelectorAll(
                ".horas-regulares, .horas-extras"
            )
            .forEach(
                function(campo) {

                    campo.value = 0;

                }
            );


        calcularTotales();


        if (
            !idEmpleado ||
            !fechaInicio ||
            !fechaFin
        ) {

            return;

        }


        try {

            const response =
                await fetch(
                    `/api/asistencia?id_empleado=${idEmpleado}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
                );


            if (!response.ok) {

                throw new Error(
                    "No se pudieron cargar las horas"
                );

            }


            const registros =
                await response.json();


            registros.forEach(
                function(registro) {

                    const fecha =
                        registro.fecha
                            .split("T")[0];


                    const celdaFecha =
                        document.querySelector(
                            `.fecha-asistencia[data-fecha="${fecha}"]`
                        );


                    if (!celdaFecha) {
                        return;
                    }


                    const offset =
                        celdaFecha.dataset.offset;


                    const campoRegular =
                        document.querySelector(
                            `.horas-regulares[data-offset="${offset}"]`
                        );


                    const campoExtra =
                        document.querySelector(
                            `.horas-extras[data-offset="${offset}"]`
                        );


                    if (campoRegular) {

                        campoRegular.value =
                            Number(
                                registro.horas_trabajadas
                            ) || 0;

                    }


                    if (campoExtra) {

                        campoExtra.value =
                            Number(
                                registro.horas_extras
                            ) || 0;

                    }

                }
            );


            calcularTotales();


        }
        catch (error) {

            console.error(
                "Error al cargar asistencia:",
                error
            );

        }

    }


    // =================================================
    // CARGAR EMPLEADOS
    // =================================================

    try {

        const response =
            await fetch(
                "/api/empleados"
            );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los empleados"
            );

        }


        const empleados =
            await response.json();


        empleados.forEach(
            function(empleado) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    empleado.id_empleado;


                opcion.textContent =
                    `${empleado.numero_empleado} - ${empleado.nombres} ${empleado.apellidos}`;


                selectEmpleado.appendChild(
                    opcion
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Error al cargar empleados:",
            error
        );

    }


    // =================================================
    // SEMANA ACTUAL POR DEFECTO
    // =================================================

    const hoy =
        new Date();

    const diaSemana =
        hoy.getDay();

    const diferenciaLunes =
        (
            diaSemana + 6
        ) % 7;


    const lunesActual =
        new Date(hoy);


    lunesActual.setDate(
        hoy.getDate() -
        diferenciaLunes
    );


    const domingoActual =
        new Date(
            lunesActual
        );


    domingoActual.setDate(
        lunesActual.getDate() + 6
    );


    inputSemana.value =
        fechaParaInput(
            lunesActual
        );


    inputHasta.value =
        fechaParaInput(
            domingoActual
        );


    generarFilasAsistencia();


    // =================================================
    // EVENTOS DEL RANGO
    // =================================================

    inputSemana.addEventListener(
        "change",
        async function() {

            generarFilasAsistencia();

            if (
                selectEmpleado.value &&
                inputSemana.value &&
                inputHasta.value
            ) {

                await cargarHorasGuardadas();

            }

        }
    );


    inputHasta.addEventListener(
        "change",
        async function() {

            generarFilasAsistencia();

            if (
                selectEmpleado.value &&
                inputSemana.value &&
                inputHasta.value
            ) {

                await cargarHorasGuardadas();

            }

        }
    );


    selectEmpleado.addEventListener(
        "change",
        cargarHorasGuardadas
    );


    // =================================================
    // TOTALES DINÁMICOS
    // =================================================

    asistenciaBody.addEventListener(
        "input",
        function(event) {

            if (
                event.target.matches(
                    ".horas-regulares, .horas-extras"
                )
            ) {

                calcularTotales();

            }

        }
    );


    // =================================================
    // GUARDAR HORAS
    // =================================================

    btnGuardarHoras.addEventListener(
        "click",
        async function() {

            const idEmpleado =
                selectEmpleado.value;


            if (!idEmpleado) {

                alert(
                    t(
                        "seleccioneEmpleadoAsistencia"
                    )
                );

                return;

            }


            const celdasFecha =
                document.querySelectorAll(
                    ".fecha-asistencia"
                );


            if (
                celdasFecha.length === 0
            ) {

                alert(
                    t("rangoFechaInvalido")
                );

                return;

            }


            const registros = [];


            for (
                const celda of celdasFecha
            ) {

                const offset =
                    celda.dataset.offset;


                const campoRegular =
                    document.querySelector(
                        `.horas-regulares[data-offset="${offset}"]`
                    );


                const campoExtra =
                    document.querySelector(
                        `.horas-extras[data-offset="${offset}"]`
                    );


                const horasRegulares =
                    Number(
                        campoRegular.value
                    ) || 0;


                const horasExtras =
                    Number(
                        campoExtra.value
                    ) || 0;


                if (
                    horasRegulares < 0 ||
                    horasExtras < 0
                ) {

                    alert(
                        t("horasInvalidas")
                    );

                    return;

                }


                if (
                    horasRegulares +
                    horasExtras >
                    24
                ) {

                    alert(
                        t(
                            "horasDiaExcedidas"
                        )
                    );

                    return;

                }


                registros.push({

                    fecha:
                        celda.dataset.fecha,

                    horas_trabajadas:
                        horasRegulares,

                    horas_extras:
                        horasExtras

                });

            }


            try {

                const response =
                    await fetch(
                        "/api/asistencia",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    id_empleado:
                                        idEmpleado,

                                    registros:
                                        registros

                                })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Error al guardar horas"
                    );

                }


                await response.json();


                alert(
                    t("horasGuardadas")
                );


                await cargarHorasGuardadas();


            }
            catch (error) {

                console.error(
                    "Error al guardar asistencia:",
                    error
                );


                alert(
                    t("errorGuardarHoras")
                );

            }

        }
    );

}


// =====================================================
// REPORTES
// =====================================================

async function cargarModuloReportes() {

    contenidoPrincipal.innerHTML = `

        <div class="reportes-header">

            <div>

                <h1>
                    ${t("reportes")}
                </h1>

                <p>
                    ${t("gestionReportes")}
                </p>

            </div>

        </div>


        <section class="reportes-card">


            <div class="reportes-tipos">

                <button
                    type="button"
                    class="reporte-tipo-btn active"
                    id="btnReporteHoras"
                >
                    ${t("reporteHoras")}
                </button>


                <button
                    type="button"
                    class="reporte-tipo-btn"
                    id="btnComprobantePago"
                >
                    ${t("comprobantePago")}
                </button>

            </div>


            <h2 id="tituloTipoReporte">
                ${t("reporteHoras")}
            </h2>


            <div class="reportes-filtros">


                <div class="form-group">

                    <label for="empleadoReporte">
                        ${t("empleadoReporte")}
                    </label>

                    <select id="empleadoReporte">

                        <option value="todos">
                            ${t("todosEmpleados")}
                        </option>

                    </select>

                </div>


                <div class="form-group">

                    <label for="reporteDesde">
                        ${t("desdeReporte")}
                    </label>

                    <input
                        type="date"
                        id="reporteDesde"
                    >

                </div>


                <div class="form-group">

                    <label for="reporteHasta">
                        ${t("hastaReporte")}
                    </label>

                    <input
                        type="date"
                        id="reporteHasta"
                    >

                </div>


                <button
                    type="button"
                    class="btn-guardar"
                    id="btnGenerarReporte"
                >
                    ${t("generarReporte")}
                </button>


            </div>


            <div
                class="reporte-resultados"
                id="reporteResultados"
            >
            </div>

        </section>
    `;


    // =================================================
    // ELEMENTOS
    // =================================================

    const empleadoReporte =
        document.getElementById(
            "empleadoReporte"
        );

    const btnReporteHoras =
        document.getElementById(
            "btnReporteHoras"
        );

    const btnComprobantePago =
        document.getElementById(
            "btnComprobantePago"
        );

    const tituloTipoReporte =
        document.getElementById(
            "tituloTipoReporte"
        );

    const btnGenerarReporte =
        document.getElementById(
            "btnGenerarReporte"
        );

    const reporteDesde =
        document.getElementById(
            "reporteDesde"
        );

    const reporteHasta =
        document.getElementById(
            "reporteHasta"
        );

    const reporteResultados =
        document.getElementById(
            "reporteResultados"
        );


    let tipoReporteActual =
        "horas";


    // =================================================
    // CARGAR EMPLEADOS
    // =================================================

    try {

        const response =
            await fetch(
                "/api/empleados"
            );


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los empleados"
            );

        }


        const empleados =
            await response.json();


        empleados.forEach(
            function(empleado) {

                const opcion =
                    document.createElement(
                        "option"
                    );


                opcion.value =
                    empleado.id_empleado;


                opcion.textContent =
                    `${empleado.numero_empleado} - ${empleado.nombres} ${empleado.apellidos}`;


                empleadoReporte.appendChild(
                    opcion
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Error al cargar empleados para reportes:",
            error
        );

    }


    // =================================================
    // CAMBIAR A REPORTE DE HORAS
    // =================================================

    btnReporteHoras.addEventListener(
        "click",
        function() {

            tipoReporteActual =
                "horas";


            btnReporteHoras
                .classList
                .add(
                    "active"
                );


            btnComprobantePago
                .classList
                .remove(
                    "active"
                );


            tituloTipoReporte.textContent =
                t("reporteHoras");


            btnGenerarReporte.textContent =
                t("generarReporte");


            reporteResultados.innerHTML =
                "";

        }
    );


    // =================================================
    // CAMBIAR A COMPROBANTE
    // =================================================

    btnComprobantePago.addEventListener(
        "click",
        function() {

            tipoReporteActual =
                "comprobante";


            btnComprobantePago
                .classList
                .add(
                    "active"
                );


            btnReporteHoras
                .classList
                .remove(
                    "active"
                );


            tituloTipoReporte.textContent =
                t("comprobantePago");


            btnGenerarReporte.textContent =
                t("generarComprobante");


            reporteResultados.innerHTML =
                "";

        }
    );


    // =================================================
    // MOSTRAR REPORTE DE HORAS
    // =================================================

    function mostrarReporteHoras(
        registros
    ) {

        if (
            registros.length === 0
        ) {

            reporteResultados.innerHTML = `

                <div class="reporte-sin-resultados">
                    ${t("sinResultadosReporte")}
                </div>
            `;

            return;

        }


        let totalRegulares = 0;
        let totalExtras = 0;

        let filasReporte = "";


        registros.forEach(
            function(registro) {

                const horasRegulares =
                    Number(
                        registro.horas_trabajadas
                    ) || 0;


                const horasExtras =
                    Number(
                        registro.horas_extras
                    ) || 0;


                totalRegulares +=
                    horasRegulares;


                totalExtras +=
                    horasExtras;


                const fecha =
                    formatearFechaUSADesdeMysql(
                        registro.fecha
                    );


                const estadoBase =
                    (registro.estado || "")
                        .trim()
                        .toLowerCase();


                let estadoTraducido = "-";


                if (estadoBase) {

                    const traduccion =
                        t(estadoBase);


                    estadoTraducido =
                        traduccion === estadoBase
                            ? registro.estado
                            : traduccion;

                }


                filasReporte += `

                    <tr>

                        <td>
                            ${registro.numero_empleado || "-"}
                        </td>

                        <td>
                            ${registro.nombres || ""}
                            ${registro.apellidos || ""}
                        </td>

                        <td>
                            ${fecha || "-"}
                        </td>

                        <td>
                            ${horasRegulares.toFixed(2)}
                        </td>

                        <td>
                            ${horasExtras.toFixed(2)}
                        </td>

                        <td>
                            ${estadoTraducido}
                        </td>

                    </tr>
                `;

            }
        );


        const totalGeneral =
            totalRegulares +
            totalExtras;


        reporteResultados.innerHTML = `

            <div class="reporte-tabla-container">

                <table class="reporte-tabla">

                    <thead>

                        <tr>

                            <th>
                                ${t("numeroEmpleadoReporte")}
                            </th>

                            <th>
                                ${t("nombreEmpleadoReporte")}
                            </th>

                            <th>
                                ${t("fechaReporte")}
                            </th>

                            <th>
                                ${t("horasRegulares")}
                            </th>

                            <th>
                                ${t("horasExtras")}
                            </th>

                            <th>
                                ${t("estadoReporte")}
                            </th>

                        </tr>

                    </thead>


                    <tbody>
                        ${filasReporte}
                    </tbody>

                </table>

            </div>


            <div class="reporte-resumen">

                <h3>
                    ${t("resumenReporte")}
                </h3>


                <div class="reporte-resumen-grid">


                    <div>

                        <span>
                            ${t("totalRegularesReporte")}
                        </span>

                        <strong>
                            ${totalRegulares.toFixed(2)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ${t("totalExtrasReporte")}
                        </span>

                        <strong>
                            ${totalExtras.toFixed(2)}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ${t("totalHorasReporte")}
                        </span>

                        <strong>
                            ${totalGeneral.toFixed(2)}
                        </strong>

                    </div>


                </div>

            </div>
        `;

    }


    // =================================================
    // MOSTRAR COMPROBANTE DE PAGO
    // =================================================

    async function mostrarComprobantePago(
        registros,
        idEmpleado,
        fechaInicio,
        fechaFin
    ) {

        if (
            registros.length === 0
        ) {

            reporteResultados.innerHTML = `

                <div class="reporte-sin-resultados">
                    ${t("sinResultadosReporte")}
                </div>
            `;

            return;

        }


        try {

            const responseEmpleado =
                await fetch(
                    `/api/empleados/${idEmpleado}`
                );


            if (!responseEmpleado.ok) {

                throw new Error(
                    "No se pudo cargar el empleado"
                );

            }


            const empleado =
                await responseEmpleado.json();


            let totalRegulares = 0;
            let totalExtras = 0;


            registros.forEach(
                function(registro) {

                    totalRegulares +=
                        Number(
                            registro.horas_trabajadas
                        ) || 0;


                    totalExtras +=
                        Number(
                            registro.horas_extras
                        ) || 0;

                }
            );


            const fechaInicioUSA =
                formatearFechaUSADesdeMysql(
                    fechaInicio
                );


            const fechaFinUSA =
                formatearFechaUSADesdeMysql(
                    fechaFin
                );


            reporteResultados.innerHTML = `

                <article class="comprobante-pago">


                    <div class="comprobante-encabezado">

                        <div>

                            <h2>
                                Wayvvy Payments
                            </h2>

                            <p>
                                ${t("comprobantePago")}
                            </p>

                        </div>


                        <div class="comprobante-periodo">

                            <span>
                                ${t("periodoPago")}
                            </span>

                            <strong>
                                ${fechaInicioUSA}
                                -
                                ${fechaFinUSA}
                            </strong>

                        </div>

                    </div>


                    <div class="comprobante-empleado">

                        <h3>
                            ${empleado.nombres || ""}
                            ${empleado.apellidos || ""}
                        </h3>

                        <p>
                            ${t("cedula")}:
                            <strong>
                                ${empleado.cedula || "-"}
                            </strong>
                        </p>

                        <p>
                            ${t("ocupacion")}:
                            <strong>
                                ${empleado.puesto || t("sinPuesto")}
                            </strong>
                        </p>

                    </div>


                    <div class="comprobante-seccion">

                        <h3>
                            ${t("ingresos")}
                        </h3>


                        <div class="comprobante-linea">

                            <span>
                                ${t("horasTrabajadas")}
                            </span>

                            <strong>
                                ${totalRegulares.toFixed(2)}
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("horasExtras")}
                            </span>

                            <strong>
                                ${totalExtras.toFixed(2)}
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("valorHora")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("salarioDevengado")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("incentivosPago")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("vacacionesPago")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea comprobante-total">

                            <span>
                                ${t("totalDevengado")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>

                    </div>


                    <div class="comprobante-seccion">

                        <h3>
                            ${t("deducciones")}
                        </h3>


                        <div class="comprobante-linea">

                            <span>
                                ${t("afp")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("sfs")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("isr")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("dependientes")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea">

                            <span>
                                ${t("otrosDescuentos")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>


                        <div class="comprobante-linea comprobante-total">

                            <span>
                                ${t("totalDeducciones")}
                            </span>

                            <strong>
                                —
                            </strong>

                        </div>

                    </div>


                    <div class="comprobante-neto">

                        <span>
                            ${t("netoPagar")}
                        </span>

                        <strong>
                            —
                        </strong>

                    </div>


                    <div class="comprobante-firmas">


                        <div>

                            <span class="linea-firma"></span>

                            <p>
                                ${t("firmaColaborador")}
                            </p>

                        </div>


                        <div>

                            <span class="linea-firma"></span>

                            <p>
                                ${t("firmaSupervisor")}
                            </p>

                        </div>


                    </div>


                </article>
            `;


        }
        catch (error) {

            console.error(
                "Error al generar comprobante:",
                error
            );

        }

    }


    // =================================================
    // GENERAR
    // =================================================

    btnGenerarReporte.addEventListener(
        "click",
        async function() {

            const fechaInicio =
                reporteDesde.value;

            const fechaFin =
                reporteHasta.value;

            const idEmpleado =
                empleadoReporte.value;


            if (
                !fechaInicio ||
                !fechaFin
            ) {

                alert(
                    t("rangoFechaInvalido")
                );

                return;

            }


            if (
                fechaFin <
                fechaInicio
            ) {

                alert(
                    t("rangoFechaInvalido")
                );

                return;

            }


            // Un comprobante es individual
            if (
                tipoReporteActual ===
                    "comprobante" &&
                idEmpleado ===
                    "todos"
            ) {

                alert(
                    t(
                        "seleccioneEmpleadoAsistencia"
                    )
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `/api/reportes/horas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&id_empleado=${idEmpleado}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "No se pudo generar el reporte"
                    );

                }


                const registros =
                    await response.json();


                if (
                    tipoReporteActual ===
                    "horas"
                ) {

                    mostrarReporteHoras(
                        registros
                    );

                }
                else {

                    await mostrarComprobantePago(
                        registros,
                        idEmpleado,
                        fechaInicio,
                        fechaFin
                    );

                }


            }
            catch (error) {

                console.error(
                    "Error al generar reporte:",
                    error
                );

            }

        }
    );

}


// =====================================================
// DASHBOARD
// =====================================================

function cargarDashboard() {

    contenidoPrincipal.innerHTML = `

        <h1>
            ${t("dashboard")}
        </h1>

        <p>
            ${t("bienvenido")}
        </p>
    `;

}


// =====================================================
// NAVEGACIÓN
// =====================================================

opcionesMenu.forEach(
    function(opcion) {

        opcion.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const pagina =
                    opcion.dataset.page;


                window.history.replaceState(
                    null,
                    "",
                    `/app.html?pagina=${pagina}`
                );


                opcionesMenu.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                opcion.classList.add(
                    "active"
                );


                if (
                    pagina ===
                    "dashboard"
                ) {

                    cargarDashboard();

                }
                else if (
                    pagina ===
                    "empleados"
                ) {

                    cargarEmpleados();

                }
                else if (
                    pagina ===
                    "asistencia"
                ) {

                    cargarModuloAsistencia();

                }
                else if (
                    pagina ===
                    "reportes"
                ) {

                    cargarModuloReportes();

                }
                else if (
                    pagina ===
                    "puestos"
                ) {

                    cargarModuloPuestos();

                }
                else {

                    contenidoPrincipal.innerHTML = `

                        <h1>
                            ${t("moduloDesarrollo")}
                        </h1>

                        <p>
                            ${t("seccionProximamente")}
                        </p>
                    `;

                }

            }
        );

    }
);


// =====================================================
// ABRIR MÓDULO DESDE URL
// =====================================================

const parametrosUrl =
    new URLSearchParams(
        window.location.search
    );


const paginaInicial =
    parametrosUrl.get(
        "pagina"
    );


if (paginaInicial) {

    const opcionInicial =
        document.querySelector(
            `.sidebar a[data-page="${paginaInicial}"]`
        );


    if (opcionInicial) {

        opcionInicial.click();

    }
    else {

        const dashboard =
            document.querySelector(
                '.sidebar a[data-page="dashboard"]'
            );


        dashboard.click();

    }

}
else {

    const dashboard =
        document.querySelector(
            '.sidebar a[data-page="dashboard"]'
        );


    dashboard.click();

}