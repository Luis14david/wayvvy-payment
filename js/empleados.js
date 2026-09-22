document.addEventListener(
    "DOMContentLoaded",
    function() {

        const empleadosBody =
            document.getElementById(
                "empleadosBody"
            );


        const buscarEmpleado =
            document.getElementById(
                "buscarEmpleado"
            );


        let empleadosGuardados = [];


        function formatearFecha(
            valorFecha
        ) {

            if (!valorFecha) {
                return "";
            }


            const fechaMysql =
                valorFecha.split("T")[0];


            const partes =
                fechaMysql.split("-");


            return `${partes[1]}/${partes[2]}/${partes[0]}`;

        }


        function obtenerClaseEstado(
            estado
        ) {

            const estadoBase =
                (
                    estado ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            if (
                estadoBase ===
                "activo"
            ) {

                return "active-status";

            }


            if (
                estadoBase ===
                "inactivo"
            ) {

                return "inactive-status";

            }


            if (
                estadoBase ===
                "suspendido"
            ) {

                return "suspended-status";

            }


            if (
                estadoBase ===
                "licencia"
            ) {

                return "license-status";

            }


            if (
                estadoBase ===
                "vacaciones"
            ) {

                return "vacation-status";

            }


            return "";

        }


        function mostrarEmpleados(
            empleados
        ) {

            empleadosBody.innerHTML =
                "";


            if (
                empleados.length === 0
            ) {

                empleadosBody.innerHTML = `

                    <tr>

                        <td colspan="7">
                            No se encontraron empleados.
                        </td>

                    </tr>
                `;

                return;

            }


            empleados.forEach(
                function(empleado) {

                    const fecha =
                        formatearFecha(
                            empleado.fecha_ingreso
                        );


                    const claseEstado =
                        obtenerClaseEstado(
                            empleado.estado
                        );


                    const estadoBase =
                        (
                            empleado.estado ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const estadoTraducido =
                        estadoBase
                            ? t(estadoBase)
                            : "-";


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
                                type="button"
                                class="action-button view-button"
                            >
                                ${t("ver")}
                            </button>


                            <button
                                type="button"
                                class="edit-button"
                                title="${t("editarEmpleado")}"
                            >
                                ✎
                            </button>

                        </td>
                    `;


                    const botonVer =
                        fila.querySelector(
                            ".view-button"
                        );


                    const botonEditar =
                        fila.querySelector(
                            ".edit-button"
                        );


                    botonVer.addEventListener(
                        "click",
                        function() {

                            window.location.href =
                                `/html/verEmpleado.html?id=${empleado.id_empleado}`;

                        }
                    );


                    botonEditar.addEventListener(
                        "click",
                        function() {

                            window.location.href =
                                `/html/ingresoDeEmpleado.html?id=${empleado.id_empleado}`;

                        }
                    );


                    empleadosBody.appendChild(
                        fila
                    );

                }
            );

        }


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


                empleadosGuardados =
                    await response.json();


                mostrarEmpleados(
                    empleadosGuardados
                );

            }
            catch (error) {

                console.error(
                    "Error al cargar empleados:",
                    error
                );

            }

        }


        buscarEmpleado.addEventListener(
            "input",
            function() {

                const texto =
                    buscarEmpleado
                        .value
                        .trim()
                        .toLowerCase();


                const resultados =
                    empleadosGuardados.filter(
                        function(empleado) {

                            const nombreCompleto =
                                `${empleado.nombres || ""} ${empleado.apellidos || ""}`
                                    .toLowerCase();


                            const cedula =
                                (
                                    empleado.cedula ||
                                    ""
                                )
                                    .toLowerCase();


                            const puesto =
                                (
                                    empleado.puesto ||
                                    ""
                                )
                                    .toLowerCase();


                            const estado =
                                (
                                    empleado.estado ||
                                    ""
                                )
                                    .toLowerCase();


                            const numeroEmpleado =
                                String(
                                    empleado.numero_empleado ||
                                    ""
                                )
                                    .toLowerCase();


                            return (
                                nombreCompleto.includes(texto) ||
                                cedula.includes(texto) ||
                                puesto.includes(texto) ||
                                estado.includes(texto) ||
                                numeroEmpleado.includes(texto)
                            );

                        }
                    );


                mostrarEmpleados(
                    resultados
                );

            }
        );


        cargarEmpleados();

    }
);