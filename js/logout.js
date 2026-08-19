const profileButton = document.getElementById("profileButton");
const profileDropdown = document.getElementById("profileDropdown");

const botonesLogout = document.querySelectorAll(".logout-button");

// =========================
// MENÚ DEL PERFIL
// =========================

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function(event) {

        event.stopPropagation();

        profileDropdown.classList.toggle("active");
    });


    document.addEventListener("click", function(event) {

        if (
            !profileButton.contains(event.target) &&
            !profileDropdown.contains(event.target)
        ) {
            profileDropdown.classList.remove("active");
        }

    });
}


// =========================
// CERRAR SESIÓN
// =========================

botonesLogout.forEach(function(boton) {

    boton.addEventListener("click", function(event) {

        event.preventDefault();

        const confirmar = confirm(
            "¿Seguro que desea cerrar sesión?"
        );

        if (confirmar) {
            window.location.href = "/";
        }

    });
});