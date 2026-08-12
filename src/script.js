const formulario = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const password = document.getElementById("password");
const mensaje = document.getElementById("mensaje");
const errorUsuario = document.getElementById("errorUsuario");
const errorPassword = document.getElementById("errorPassword");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const valorUsuario = usuario.value.trim();
    const valorPassword = password.value.trim();

    usuario.classList.remove("input-error");
    password.classList.remove("input-error");

    errorUsuario.style.display = "none";
    errorPassword.style.display = "none";

    if (valorUsuario === "" || valorPassword === "") {

    mensaje.textContent = "Debe completar todos los campos";
    mensaje.style.color = "red";


    if (valorUsuario === "") {

        usuario.classList.add("input-error");
        errorUsuario.style.display = "block";

    }


    if (valorPassword === "") {

        password.classList.add("input-error");
        errorPassword.style.display = "block";

    }

}

});

usuario.addEventListener("input", function() {

    if (usuario.value.trim() !== "") {
        usuario.classList.remove("input-error");
        errorUsuario.style.display = "none";
    }

    if (
        usuario.value.trim() !== "" &&
        password.value.trim() !== ""
    ) {
        mensaje.textContent = "";
    }

});


password.addEventListener("input", function() {

    if (password.value.trim() !== "") {
        password.classList.remove("input-error");
        errorPassword.style.display = "none";
    }

    if (
        usuario.value.trim() !== "" &&
        password.value.trim() !== ""
    ) {
        mensaje.textContent = "";
    }

});