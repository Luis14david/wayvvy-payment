document.addEventListener(
    "DOMContentLoaded",
    async function() {

        // =================================================
        // ELEMENTOS
        // =================================================

        const empleadoIncentivo =
            document.getElementById(
                "empleadoIncentivo"
            );


        const nominaIncentivo =
            document.getElementById(
                "nominaIncentivo"
            );


        const incentivoForm =
            document.getElementById(
                "incentivoForm"
            );


        const montoIncentivo =
            document.getElementById(
                "montoIncentivo"
            );


        const descripcionIncentivo =
            document.getElementById(
                "descripcionIncentivo"
            );


        const listaIncentivos =
            document.getElementById(
                "listaIncentivos"
            );


        const btnGuardarIncentivo =
            document.getElementById(
                "btnGuardarIncentivo"
            );


        const btnCancelarEdicionIncentivo =
            document.getElementById(
                "btnCancelarEdicionIncentivo"
            );


        // =================================================
        // FUNCIONES AUXILIARES
        // =================================================

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


            return `${partes[1]}/${partes[2]}/${partes[0]}`;

        }


        function formatearDineroIncentivo(
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


        function escaparHTML(
            valor
        ) {

            return String(
                valor || ""
            )
                .replaceAll(
                    "&",
                    "&amp;"
                )
                .replaceAll(
                    "<",
                    "&lt;"
                )
                .replaceAll(
                    ">",
                    "&gt;"
                )
                .replaceAll(
                    '"',
                    "&quot;"
                )
                .replaceAll(
                    "'",
                    "&#039;"
                );

        }


        function cancelarEdicionIncentivo() {

            delete incentivoForm.dataset.idIncentivo;


            montoIncentivo.value = "";

            descripcionIncentivo.value = "";


            btnGuardarIncentivo.textContent =
            t("guardarIncentivo");


            btnCancelarEdicionIncentivo.style.display =
                "none";

        }


        // =================================================
        // CARGAR EMPLEADOS
        // =================================================

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


                        empleadoIncentivo.appendChild(
                            opcion
                        );

                    }
                );

            }
            catch (error) {

                console.error(
                    "Error al cargar empleados para incentivos:",
                    error
                );

            }

        }


        // =================================================
        // CARGAR NÓMINAS
        // =================================================

        async function cargarNominas() {

            try {

                const response =
                    await fetch(
                        "/api/nominas"
                    );


                if (!response.ok) {

                    throw new Error(
                        "No se pudieron cargar las nóminas"
                    );

                }


                const nominas =
                    await response.json();


                nominas.forEach(
                    function(nomina) {

                        const opcion =
                            document.createElement(
                                "option"
                            );


                        opcion.value =
                            nomina.id_nomina;


                        opcion.dataset.estado =
                            nomina.estado;


                        const fechaInicio =
                            formatearFechaUSADesdeMysql(
                                nomina.periodo_inicio
                            );


                        const fechaFin =
                            formatearFechaUSADesdeMysql(
                                nomina.periodo_fin
                            );


                        opcion.textContent =
                            `${fechaInicio} - ${fechaFin} (${nomina.estado})`;


                        nominaIncentivo.appendChild(
                            opcion
                        );

                    }
                );

            }
            catch (error) {

                console.error(
                    "Error al cargar nóminas para incentivos:",
                    error
                );

            }

        }


        // =================================================
        // LISTAR INCENTIVOS
        // =================================================

        async function cargarListaIncentivos() {

            const idEmpleado =
                empleadoIncentivo.value;


            const idNomina =
                nominaIncentivo.value;


            if (
                !idEmpleado ||
                !idNomina
            ) {

                listaIncentivos.innerHTML = `

                    <div class="reporte-sin-resultados">
                        ${t("sinIncentivos")}
                    </div>
                `;

                return;

            }


            try {

                const response =
                    await fetch(
                        `/api/incentivos?id_empleado=${idEmpleado}&id_nomina=${idNomina}`
                    );


                if (!response.ok) {

                    throw new Error(
                        "No se pudieron cargar los incentivos"
                    );

                }


                const incentivos =
                    await response.json();


                if (
                    incentivos.length === 0
                ) {

                    listaIncentivos.innerHTML = `

                        <div class="reporte-sin-resultados">
                            ${t("sinIncentivos")}
                        </div>
                    `;

                    return;

                }


                let filas = "";


                incentivos.forEach(
                    function(incentivo) {

                        const descripcion =
                            incentivo.descripcion || "-";


                        filas += `

                            <tr>

                                <td>
                                    ${formatearDineroIncentivo(
                                        incentivo.monto
                                    )}
                                </td>

                                <td>
                                    ${escaparHTML(
                                        descripcion
                                    )}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        class="editar-incentivo"
                                        data-id="${incentivo.id_detalle_concepto}"
                                        data-monto="${Number(incentivo.monto) || 0}"
                                        data-descripcion="${escaparHTML(incentivo.descripcion || "")}"
                                    >
                                        ${t("editarIncentivo")}
                                    </button>


                                    <button
                                        type="button"
                                        class="eliminar-incentivo"
                                        data-id="${incentivo.id_detalle_concepto}"
                                    >
                                        ${t("eliminarIncentivo")}
                                    </button>

                                </td>

                            </tr>
                        `;

                    }
                );


                listaIncentivos.innerHTML = `

                    <div class="reporte-tabla-container">

                        <table class="reporte-tabla">

                            <thead>

                                <tr>

                                    <th>
                                        ${t("monto")}
                                    </th>

                                    <th>
                                        ${t("descripcion")}
                                    </th>

                                    <th>
                                        ${t("acciones")}
                                    </th>

                                </tr>

                            </thead>


                            <tbody>
                                ${filas}
                            </tbody>

                        </table>

                    </div>
                `;

            }
            catch (error) {

                console.error(
                    "Error al cargar incentivos:",
                    error
                );

            }

        }


        // =================================================
        // CAMBIO DE EMPLEADO O PERÍODO
        // =================================================

        empleadoIncentivo.addEventListener(
            "change",
            async function() {

                cancelarEdicionIncentivo();

                await cargarListaIncentivos();

            }
        );


        nominaIncentivo.addEventListener(
            "change",
            async function() {

                cancelarEdicionIncentivo();

                await cargarListaIncentivos();

            }
        );


        // =================================================
        // EDITAR / ELIMINAR
        // =================================================

        listaIncentivos.addEventListener(
            "click",
            async function(event) {

                const botonEditar =
                    event.target.closest(
                        ".editar-incentivo"
                    );


                const botonEliminar =
                    event.target.closest(
                        ".eliminar-incentivo"
                    );


                // =========================================
                // EDITAR
                // =========================================

                if (botonEditar) {

                    incentivoForm.dataset.idIncentivo =
                        botonEditar.dataset.id;


                    montoIncentivo.value =
                        botonEditar.dataset.monto || "";


                    descripcionIncentivo.value =
                        botonEditar.dataset.descripcion || "";


                    btnGuardarIncentivo.textContent =
                    t("guardarCambiosIncentivo");


                    btnCancelarEdicionIncentivo.style.display =
                        "inline-block";


                    montoIncentivo.focus();


                    return;

                }


                // =========================================
                // ELIMINAR
                // =========================================

                if (botonEliminar) {

                    const idIncentivo =
                        botonEliminar.dataset.id;


                    const confirmar =
                        confirm(
                            "¿Seguro que desea eliminar este incentivo?"
                        );


                    if (!confirmar) {
                        return;
                    }


                    try {

                        const response =
                            await fetch(
                                `/api/incentivos/${idIncentivo}`,
                                {
                                    method:
                                        "DELETE"
                                }
                            );


                        const resultado =
                            await response.json();


                        if (!response.ok) {

                            throw new Error(
                                resultado.error ||
                                "No se pudo eliminar el incentivo"
                            );

                        }


                        if (
                            incentivoForm.dataset.idIncentivo ===
                            idIncentivo
                        ) {

                            cancelarEdicionIncentivo();

                        }


                        await cargarListaIncentivos();


                        alert(
                            "Incentivo eliminado correctamente"
                        );

                    }
                    catch (error) {

                        console.error(
                            "Error al eliminar incentivo:",
                            error
                        );


                        alert(
                            error.message
                        );

                    }

                }

            }
        );


        // =================================================
        // CANCELAR EDICIÓN
        // =================================================

        btnCancelarEdicionIncentivo.addEventListener(
            "click",
            cancelarEdicionIncentivo
        );


        // =================================================
        // GUARDAR / ACTUALIZAR
        // =================================================

        incentivoForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                const idEmpleado =
                    empleadoIncentivo.value;


                const idNomina =
                    nominaIncentivo.value;


                const monto =
                    Number(
                        montoIncentivo.value
                    );


                const descripcion =
                    descripcionIncentivo
                        .value
                        .trim();


                const idIncentivo =
                    incentivoForm.dataset.idIncentivo;


                if (!idEmpleado) {

                    alert(
                        "Seleccione un empleado"
                    );

                    return;

                }


                if (!idNomina) {

                    alert(
                        "Seleccione un período"
                    );

                    return;

                }


                if (
                    !Number.isFinite(monto) ||
                    monto <= 0
                ) {

                    alert(
                        "El monto debe ser mayor que cero"
                    );

                    return;

                }


                try {

                    let response;


                    // ======================================
                    // ACTUALIZAR
                    // ======================================

                    if (idIncentivo) {

                        response =
                            await fetch(
                                `/api/incentivos/${idIncentivo}`,
                                {
                                    method:
                                        "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            monto:
                                                monto,

                                            descripcion:
                                                descripcion

                                        })
                                }
                            );

                    }


                    // ======================================
                    // CREAR
                    // ======================================

                    else {

                        response =
                            await fetch(
                                "/api/incentivos",
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            id_empleado:
                                                idEmpleado,

                                            id_nomina:
                                                idNomina,

                                            monto:
                                                monto,

                                            descripcion:
                                                descripcion

                                        })
                                }
                            );

                    }


                    const resultado =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            resultado.error ||
                            "No se pudo guardar el incentivo"
                        );

                    }


                    cancelarEdicionIncentivo();


                    await cargarListaIncentivos();


                    alert(
                        idIncentivo
                            ? "Incentivo actualizado correctamente"
                            : "Incentivo guardado correctamente"
                    );

                }
                catch (error) {

                    console.error(
                        "Error al guardar incentivo:",
                        error
                    );


                    alert(
                        error.message
                    );

                }

            }
        );


        // =================================================
        // INICIAR
        // =================================================

        await cargarEmpleados();

        await cargarNominas();

    }
);