const empleadosBody = document.getElementById("empleadosBody");

fetch("/api/empleados")
    .then(response => response.json())
    .then(empleados => {

        empleadosBody.innerHTML = "";

        empleados.forEach(empleado => {

            let fecha = "";

            if (empleado.fecha_ingreso) {
                const fechaOriginal = empleado.fecha_ingreso.split("T")[0];
                const partes = fechaOriginal.split("-");

                fecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${empleado.numero_empleado}</td>

                <td>
                    ${empleado.nombres} ${empleado.apellidos}
                </td>

                <td>${empleado.cedula}</td>

                <td>${empleado.puesto || "Sin puesto"}</td>

                <td>${fecha}</td>

                <td>
                    <span class="status active-status">
                        ${empleado.estado}
                    </span>
                </td>

                <td class="acciones-empleado">

    <button
    class="action-button view-button"
    data-id="${empleado.id_empleado}"
>
    Ver
</button>

   <button
    class="edit-button"
    data-id="${empleado.id_empleado}"
    title="Editar empleado"
>
    ✎
</button>
</td>
            `;

            empleadosBody.appendChild(fila);

            const botonEditar = fila.querySelector(".edit-button");

const botonVer = fila.querySelector(".view-button");

botonVer.addEventListener("click", function () {
    window.location.href =
        `/verEmpleado.html?id=${empleado.id_empleado}`;
});

botonEditar.addEventListener("click", function () {
    window.location.href =
        `/ingresoDeEmpleado.html?id=${empleado.id_empleado}`;
});

        });
    })
    .catch(error => {
        console.error("Error al cargar empleados:", error);
    });