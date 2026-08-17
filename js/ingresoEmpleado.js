const btnCancelar = document.getElementById("btnCancelar");
const formulario = document.querySelector(".employee-form");

btnCancelar.addEventListener("click", function(event) {

    const campos = formulario.querySelectorAll("input, select");

    let hayDatos = false;

    campos.forEach(function(campo) {

        if (campo.value.trim() !== "") {
            hayDatos = true;
        }

    });

    if (hayDatos) {

        event.preventDefault();

        const confirmar = confirm(
            "Hay datos ingresados en el formulario. ¿Seguro que desea cancelar?"
        );

        if (confirmar) {
            window.location.href = "empleados.html";
        }
    }

});

const parametros = new URLSearchParams(window.location.search);
const idEmpleado = parametros.get("id");

if (idEmpleado) {

    fetch(`/api/empleados/${idEmpleado}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el empleado");
            }

            return response.json();
        })
        .then(empleado => {

            document.getElementById("nombres").value = empleado.nombres || "";
            document.getElementById("apellidos").value = empleado.apellidos || "";
            document.getElementById("cedula").value = empleado.cedula || "";
            document.getElementById("sexo").value = empleado.sexo || "";

            document.getElementById("nacimiento").value =
                empleado.fecha_nacimiento
                    ? empleado.fecha_nacimiento.split("T")[0]
                    : "";

            document.getElementById("telefono").value = empleado.telefono || "";
            document.getElementById("correo").value = empleado.correo || "";
            document.getElementById("direccion").value = empleado.direccion || "";

            document.getElementById("fecha_ingreso").value =
                empleado.fecha_ingreso
                    ? empleado.fecha_ingreso.split("T")[0]
                    : "";

            document.getElementById("salario_base").value =
                empleado.salario_base || "";

            document.getElementById("id_puesto").value =
                empleado.id_puesto || "";

            document.getElementById("estado").value =
                empleado.estado ? empleado.estado.toLowerCase() : "";

            const botonGuardar = document.querySelector(".btn-agregar");

            botonGuardar.textContent = "Guardar cambios";

            // Temporalmente evitamos guardar hasta conectar el UPDATE
            botonGuardar.disabled = false;
        })
        .catch(error => {
            console.error("Error al cargar empleado:", error);
            alert("No se pudieron cargar los datos del empleado.");
        });
}

if (idEmpleado) {

    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        const datosEmpleado = {
            nombres: document.getElementById("nombres").value,
            apellidos: document.getElementById("apellidos").value,
            cedula: document.getElementById("cedula").value,
            sexo: document.getElementById("sexo").value,
            nacimiento: document.getElementById("nacimiento").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            direccion: document.getElementById("direccion").value,
            fecha_ingreso: document.getElementById("fecha_ingreso").value,
            salario_base: document.getElementById("salario_base").value,
            id_puesto: document.getElementById("id_puesto").value,
            estado: document.getElementById("estado").value
        };

        fetch(`/api/empleados/${idEmpleado}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datosEmpleado)
        })

        .then(response => {

            if (!response.ok) {
                throw new Error("No se pudo actualizar el empleado");
            }

            return response.json();
        })

        .then(resultado => {

            alert(resultado.mensaje);

            window.location.href = "/empleados.html";
        })

        .catch(error => {

            console.error("Error al actualizar empleado:", error);

            alert("Ocurrió un error al actualizar el empleado.");
        });

    });
}