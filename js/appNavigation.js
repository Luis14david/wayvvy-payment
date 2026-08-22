const contenidoPrincipal =
    document.getElementById("contenidoPrincipal");

const opcionesMenu =
    document.querySelectorAll(".sidebar a[data-page]");


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
        document.getElementById("empleadosBody");


    try {

        const response =
            await fetch("/api/empleados");


        if (!response.ok) {

            throw new Error(
                "No se pudieron cargar los empleados"
            );

        }


        const empleados =
            await response.json();


        empleados.forEach(function(empleado) {

            // ==========================================
            // FECHA DE INGRESO
            // FORMATO ESTADOS UNIDOS: MM/DD/YYYY
            // ==========================================

            let fecha = "";

            if (empleado.fecha_ingreso) {

                const fechaOriginal =
                    empleado.fecha_ingreso.split("T")[0];

                const partes =
                    fechaOriginal.split("-");


                fecha =
                    `${partes[1]}/${partes[2]}/${partes[0]}`;
            }


            // =========================
// ESTADO Y COLOR
// =========================

// Valor original que viene de MySQL
const estadoBase =
    (empleado.estado || "")
        .trim()
        .toLowerCase();

let claseEstado = "";

if (estadoBase === "activo") {
    claseEstado = "active-status";
}
else if (estadoBase === "inactivo") {
    claseEstado = "inactive-status";
}
else if (estadoBase === "suspendido") {
    claseEstado = "suspended-status";
}
else if (estadoBase === "licencia") {
    claseEstado = "license-status";
}
else if (estadoBase === "vacaciones") {
    claseEstado = "vacation-status";
}


// Traducir solamente el texto visible
const estadoTraducido =
    estadoBase
        ? t(estadoBase)
        : t("sinEstado");


            // ==========================================
            // CREAR FILA
            // ==========================================

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${empleado.numero_empleado}
                </td>


                <td>
                    ${empleado.nombres}
                    ${empleado.apellidos}
                </td>


                <td>
                    ${empleado.cedula}
                </td>


                <td>
                    ${empleado.puesto || t("sinPuesto")}
                </td>


                <td>
                    ${fecha}
                </td>


                <td>

                    <span class="status ${claseEstado}">
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


            // ==========================================
            // VER EMPLEADO
            // ==========================================

            const botonVer =
                fila.querySelector(".view-button");


            botonVer.addEventListener(
                "click",
                function() {

                    cargarVerEmpleado(
                        empleado.id_empleado
                    );

                }
            );


            // ==========================================
            // EDITAR EMPLEADO
            // ==========================================

            const botonEditar =
                fila.querySelector(".edit-button");


            botonEditar.addEventListener(
                "click",
                function() {

                    window.location.href =
                        `/ingresoDeEmpleado.html?id=${empleado.id_empleado}`;

                }
            );


            empleadosBody.appendChild(fila);

        });


    } catch (error) {

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

async function cargarVerEmpleado(idEmpleado) {

    contenidoPrincipal.innerHTML = `

        <div class="employee-view-card">

            <div class="employee-view-header">

                <div>
                    <h1>${t("detalleEmpleado")}</h1>

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

        // ==========================================
        // FECHA DE NACIMIENTO
        // MM/DD/YYYY
        // ==========================================

        let fechaNacimiento = "";


        if (empleado.fecha_nacimiento) {

            const fecha =
                empleado.fecha_nacimiento
                    .split("T")[0];

            const partes =
                fecha.split("-");


            fechaNacimiento =
                `${partes[1]}/${partes[2]}/${partes[0]}`;

        }


        // ==========================================
        // FECHA DE INGRESO
        // MM/DD/YYYY
        // ==========================================

        let fechaIngreso = "";


        if (empleado.fecha_ingreso) {

            const fecha =
                empleado.fecha_ingreso
                    .split("T")[0];

            const partes =
                fecha.split("-");


            fechaIngreso =
                `${partes[1]}/${partes[2]}/${partes[0]}`;

        }


        // ==========================================
        // SALARIO
        // ==========================================

        const salario =
            Number(
                empleado.salario_base || 0
            ).toLocaleString(
                "es-DO",
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


    } catch (error) {

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

                <h1>${t("puestos")}</h1>

                <p>
                    ${t("administracionPuestos")}
                </p>

            </div>

        </div>


        <section class="puesto-form-card">

            <h2>${t("nuevoPuesto")}</h2>


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

                <h2>${t("puestosRegistrados")}</h2>

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
    // CARGAR LISTA DE PUESTOS
    // =================================================

    try {

        const responsePuestos =
            await fetch("/api/puestos");


        if (!responsePuestos.ok) {

            throw new Error(
                "No se pudieron cargar los puestos"
            );

        }


        const puestos =
            await responsePuestos.json();


        puestosBody.innerHTML = "";


        puestos.forEach(function(puesto) {

            const fila =
                document.createElement("tr");


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


            // ==========================================
            // EDITAR PUESTO
            // ==========================================

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


            puestosBody.appendChild(fila);

        });


    } catch (error) {

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
    // GUARDAR / EDITAR PUESTO
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


                // ======================================
                // EDITAR
                // ======================================

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


                // ======================================
                // NUEVO
                // ======================================

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


            } catch (error) {

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

opcionesMenu.forEach(function(opcion) {

    opcion.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const pagina =
                opcion.dataset.page;


            // Quitar opción activa anterior
            opcionesMenu.forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            // Marcar opción actual
            opcion.classList.add(
                "active"
            );


            if (pagina === "dashboard") {

                cargarDashboard();

            }

            else if (pagina === "empleados") {

                cargarEmpleados();

            }

            else if (pagina === "puestos") {

                cargarModuloPuestos();

            }

            else {

                contenidoPrincipal.innerHTML = `

                    <h1>
                        Módulo en desarrollo
                    </h1>

                    <p>
                        Esta sección será implementada
                        próximamente.
                    </p>

                `;

            }

        }
    );

});


// =====================================================
// ABRIR MÓDULO DESDE URL
// =====================================================

const parametrosUrl =
    new URLSearchParams(
        window.location.search
    );


const paginaInicial =
    parametrosUrl.get("pagina");


// =====================================================
// ABRIR Y MARCAR MÓDULO INICIAL
// =====================================================

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