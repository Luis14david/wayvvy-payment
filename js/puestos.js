const puestoForm = document.getElementById("puestoForm");

puestoForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const datosPuesto = {
        nombre_puesto: document.getElementById("nombre_puesto").value,
        descripcion: document.getElementById("descripcion").value,
        id_departamento: null
    };

    try {

        const response = await fetch("/api/puestos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPuesto)
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.error || "No se pudo guardar el puesto");
        }

        alert(resultado.mensaje);

        puestoForm.reset();

    } catch (error) {

        console.error("Error al guardar puesto:", error);

        alert("Ocurrió un error al guardar el puesto.");
    }

});