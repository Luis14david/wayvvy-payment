document.addEventListener("DOMContentLoaded", async function () {

    const totalEmpleados =
        document.getElementById("totalEmpleados");

    const empleadosActivos =
        document.getElementById("empleadosActivos");

    const nominasBorrador =
        document.getElementById("nominasBorrador");

    const totalPuestos =
        document.getElementById("totalPuestos");


    // Cada barra representa la cantidad de empleados con un mismo estado.
    function dibujarGrafico(empleados) {
        const lista = document.getElementById("graficoEmpleados");
        const mensaje = document.getElementById("estadoGrafico");
        lista.replaceChildren();
        mensaje.textContent = empleados.length ? `${empleados.length} empleados registrados` : "No hay empleados registrados.";
        const cantidades = new Map();
        empleados.forEach(empleado => {
            const estado = String(empleado.estado || "Sin estado").trim() || "Sin estado";
            cantidades.set(estado, (cantidades.get(estado) || 0) + 1);
        });


        
        const maximo = Math.max(1, ...cantidades.values());
        [...cantidades].sort((a, b) => b[1] - a[1]).forEach(([estado, cantidad]) => {
            const fila = document.createElement("li");
            const nombre = document.createElement("span");
            const pista = document.createElement("span");
            const barra = document.createElement("span");
            const valor = document.createElement("strong");
            nombre.textContent = estado;
            valor.textContent = cantidad;
            pista.className = "chart-track";
            pista.setAttribute("aria-hidden", "true");
            barra.className = "chart-bar";
            barra.style.width = `${cantidad / maximo * 100}%`;
            pista.append(barra);
            fila.append(nombre, pista, valor);
            lista.append(fila);
        });
    }

    async function cargarEmpleados() {

        try {

            const respuesta =
                await fetch("/api/empleados");

            if (!respuesta.ok) throw new Error("No se pudieron cargar los empleados.");
            const empleados =
                await respuesta.json();
            if (!Array.isArray(empleados)) throw new Error("Respuesta de empleados inválida.");


            totalEmpleados.textContent =
                empleados.length;


            const activos =
                empleados.filter(function (empleado) {

                    return empleado.estado === "Activo";

                });


            empleadosActivos.textContent =
                activos.length;
            dibujarGrafico(empleados);

        }
        catch (error) {

            console.error(
                "Error al cargar empleados:",
                error
            );
            totalEmpleados.textContent = "—";
            empleadosActivos.textContent = "—";
            document.getElementById("estadoGrafico").textContent = "No se pudieron cargar los empleados. Recarga la página para intentar de nuevo.";

        }

    }


    async function cargarNominas() {

        try {

            const respuesta =
                await fetch("/api/nominas");

            const nominas =
                await respuesta.json();


            const borradores =
                nominas.filter(function (nomina) {

                    return nomina.estado === "Borrador";

                });


            nominasBorrador.textContent =
                borradores.length;

        }
        catch (error) {

            console.error(
                "Error al cargar nóminas:",
                error
            );

        }

    }


    async function cargarPuestos() {

        try {

            const respuesta =
                await fetch("/api/puestos");

            const puestos =
                await respuesta.json();


            totalPuestos.textContent =
                puestos.length;

        }
        catch (error) {

            console.error(
                "Error al cargar puestos:",
                error
            );

        }

    }


    await Promise.all([
        cargarEmpleados(),
        cargarNominas(),
        cargarPuestos()
    ]);

});
