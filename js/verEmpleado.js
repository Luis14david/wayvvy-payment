const parametros = new URLSearchParams(window.location.search);
const idEmpleado = parametros.get("id");

function formatearFecha(fecha) {

    if (!fecha) {
        return "-";
    }

    const fechaLimpia = fecha.split("T")[0];
    const partes = fechaLimpia.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

if (idEmpleado) {

    fetch(`/api/empleados/${idEmpleado}`)
        .then(response => {

            if (!response.ok) {
                throw new Error("No se pudo cargar el empleado");
            }

            return response.json();
        })

        .then(empleado => {

            document.getElementById("numero_empleado").textContent =
                empleado.numero_empleado || "-";

            document.getElementById("nombre_completo").textContent =
                `${empleado.nombres} ${empleado.apellidos}`;

            document.getElementById("cedula").textContent =
                empleado.cedula || "-";

            document.getElementById("sexo").textContent =
                empleado.sexo || "-";

            document.getElementById("fecha_nacimiento").textContent =
                formatearFecha(empleado.fecha_nacimiento);

            document.getElementById("telefono").textContent =
                empleado.telefono || "-";

            document.getElementById("correo").textContent =
                empleado.correo || "-";

            document.getElementById("direccion").textContent =
                empleado.direccion || "-";

            document.getElementById("fecha_ingreso").textContent =
                formatearFecha(empleado.fecha_ingreso);

            document.getElementById("salario_base").textContent =
                empleado.salario_base
                    ? `RD$ ${Number(empleado.salario_base).toLocaleString("es-DO", {
                        minimumFractionDigits: 2
                    })}`
                    : "-";

            document.getElementById("id_puesto").textContent =
                empleado.id_puesto || "-";

            document.getElementById("estado").textContent =
                empleado.estado || "-";
        })

        .catch(error => {

            console.error("Error al cargar empleado:", error);

            alert("No se pudieron cargar los datos del empleado.");
        });

} else {

    alert("No se indicó ningún empleado.");

    window.location.href = "/empleados.html";
}