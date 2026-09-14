document.addEventListener(
    "DOMContentLoaded",
    async function() {


        // Elementos

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


        const btnCalendarioReporteDesde =
            document.getElementById(
                "btnCalendarioReporteDesde"
            );


        const btnCalendarioReporteHasta =
            document.getElementById(
                "btnCalendarioReporteHasta"
            );


        const reporteResultados =
            document.getElementById(
                "reporteResultados"
            );


        let tipoReporteActual =
            "horas";



        // Fechas

        function formatearFechaUSADesdeMysql(
            valorFecha
        ) {

            if (!valorFecha) {
                return "";
            }


            const fechaMysql =
                valorFecha.split("T")[0];


            const partes =
                fechaMysql.split("-");


            if (partes.length !== 3) {
                return valorFecha;
            }


            return `${partes[1]}/${partes[2]}/${partes[0]}`;

        }



        // Dinero

        function formatearDinero(
            valor
        ) {

            return Number(
                valor || 0
            ).toLocaleString(
                "es-DO",
                {
                    style: "currency",
                    currency: "DOP",
                    minimumFractionDigits: 2
                }
            );

        }



        // Calendarios

        btnCalendarioReporteDesde.addEventListener(
            "click",
            function() {

                if (
                    reporteDesde.showPicker
                ) {

                    reporteDesde.showPicker();

                }
                else {

                    reporteDesde.focus();

                }

            }
        );


        btnCalendarioReporteHasta.addEventListener(
            "click",
            function() {

                if (
                    reporteHasta.showPicker
                ) {

                    reporteHasta.showPicker();

                }
                else {

                    reporteHasta.focus();

                }

            }
        );



        // Cargar empleados

        async function cargarEmpleados() {

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
                    "Error al cargar empleados:",
                    error
                );

            }

        }



        // Reporte de horas

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



        // Comprobante de pago

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



        // Mostrar reporte de horas

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
                        (
                            registro.estado ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    let estadoTraducido =
                        "-";


                    if (estadoBase) {

                        const traduccion =
                            t(
                                estadoBase
                            );


                        estadoTraducido =
                            traduccion ===
                            estadoBase
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



        // Comprobante

        async function mostrarComprobantePago(
            registros,
            idEmpleado,
            fechaInicio,
            fechaFin
        ) {

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



                const respuesta = await fetch('/api/reportes/calculo?'+new URLSearchParams({
                    id_empleado:idEmpleado,fecha_inicio:fechaInicio,fecha_fin:fechaFin}));
                const calculo = await respuesta.json();
                if (!respuesta.ok) throw new Error(calculo.error || 'No se pudo calcular el comprobante.');
                const totalRegulares = calculo.minutos_normales / 60;
                const totalExtras = calculo.minutos_excedentes / 60;
                const fechaInicioUSA = formatearFechaUSADesdeMysql(fechaInicio);
                const fechaFinUSA = formatearFechaUSADesdeMysql(fechaFin);
                const salarioDevengado = Number(calculo.importe_normal);
                const pagoHorasExtras = Number(calculo.importe_excedente);
                const totalDevengado = Number(calculo.bruto);
                const afp = Number(calculo.afp), sfs = Number(calculo.sfs), isr = Number(calculo.isr);
                const dependientes = 0, otrosDescuentos = 0;
                const totalDeducciones = Number(calculo.deducciones);
                const netoPagar = calculo.neto;

                reporteResultados.innerHTML = `

                    <article class="comprobante-pago">


                        <div class="comprobante-encabezado">

                            <div>

                                <h2>
                                    Wayvvy Payments
                                </h2>

                                <p>
                                    Resumen del período
                                </p>

                            </div>


                            <div class="comprobante-periodo">

                                <span>
                                    ${t("periodoPago")}
                                </span>

                                <strong>
                                    ${fechaInicioUSA} - ${fechaFinUSA}
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
                                    Horas normales
                                </span>

                                <strong>
                                    ${totalRegulares.toFixed(2)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    Excedente semanal
                                </span>

                                <strong>
                                    ${totalExtras.toFixed(2)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    Importe excedente
                                </span>

                                <strong>
                                    ${formatearDinero(pagoHorasExtras)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("salarioDevengado")}
                                </span>

                                <strong>
                                    ${formatearDinero(salarioDevengado)}
                                </strong>

                            </div>


                            <div class="
                                comprobante-linea
                                comprobante-total
                            ">

                                <span>
                                    ${t("totalDevengado")}
                                </span>

                                <strong>
                                    ${formatearDinero(totalDevengado)}
                                </strong>

                            </div>

                        </div>



                        <div class="comprobante-seccion">

                            <h3>
                                Descuentos acumulados
                            </h3>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("afp")}
                                </span>

                                <strong>
                                    ${formatearDinero(afp)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("sfs")}
                                </span>

                                <strong>
                                    ${formatearDinero(sfs)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("isr")}
                                </span>

                                <strong>
                                    ${formatearDinero(isr)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("dependientes")}
                                </span>

                                <strong>
                                    ${formatearDinero(dependientes)}
                                </strong>

                            </div>


                            <div class="comprobante-linea">

                                <span>
                                    ${t("otrosDescuentos")}
                                </span>

                                <strong>
                                    ${formatearDinero(otrosDescuentos)}
                                </strong>

                            </div>


                            <div class="
                                comprobante-linea
                                comprobante-total
                            ">

                                <span>
                                    ${t("totalDeducciones")}
                                </span>

                                <strong>
                                    ${formatearDinero(totalDeducciones)}
                                </strong>

                            </div>

                        </div>



                        <div class="comprobante-neto">

                            <span>
                                Neto del período
                            </span>

                            <strong>
                                ${formatearDinero(netoPagar)}
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

                reporteResultados.textContent = error.message || "No se pudo generar el resumen.";
                console.error(
                    "Error al generar comprobante:",
                    error
                );

            }

        }



        // Generar reporte

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



        // Inicio

        await cargarEmpleados();

    }
);