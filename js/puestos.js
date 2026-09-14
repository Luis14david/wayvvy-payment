document.addEventListener(
    "DOMContentLoaded",
    function() {

        const puestoForm =
            document.getElementById(
                "puestoForm"
            );

        const puestosBody =
            document.getElementById(
                "puestosBody"
            );

        const btnCancelarEdicion =
            document.getElementById(
                "btnCancelarEdicion"
            );


        // Cargar puestos

        async function cargarPuestos() {

            try {

                const response =
                    await fetch(
                        "/api/puestos"
                    );


                if (!response.ok) {

                    throw new Error(
                        t("errorCargarPuestos")
                    );

                }


                const puestos =
                    await response.json();


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
                                ${puesto.descripcion || "-"}
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="edit-button editar-puesto"
                                >
                                    ✎
                                </button>

                            </td>
                        `;


                        const botonEditar =
                            fila.querySelector(
                                ".editar-puesto"
                            );


                        botonEditar.addEventListener(
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


                                if (btnCancelarEdicion) {

                                    btnCancelarEdicion.style.display =
                                        "inline-block";

                                }

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

        }


        // Cancelar edición

        if (btnCancelarEdicion) {

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
                        "Guardar puesto";


                    btnCancelarEdicion.style.display =
                        "none";

                }
            );

        }


        // Guardar o editar

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

                    id_departamento:
                        null

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
                                    method:
                                        "PUT",

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
                                    method:
                                        "POST",

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
                            "No se pudo guardar el puesto"
                        );

                    }


                    alert(
                        resultado.mensaje
                    );


                    puestoForm.reset();

                    delete puestoForm.dataset.idPuesto;


                    const botonGuardar =
                        puestoForm.querySelector(
                            ".btn-guardar"
                        );


                    botonGuardar.textContent =
                        t("guardarPuesto");


                    if (btnCancelarEdicion) {

                        btnCancelarEdicion.style.display =
                            "none";

                    }


                    await cargarPuestos();

                }
                catch (error) {

                    console.error(
                        "Error al guardar puesto:",
                        error
                    );


                    alert(
                        "Ocurrió un error al guardar el puesto."
                    );

                }

            }
        );


        cargarPuestos();

    }
);

