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