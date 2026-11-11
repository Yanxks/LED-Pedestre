
document.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem("ledpedestre_session");
    const loginLink = document.getElementById("nav-login");

    if (loginLink && user) {

        loginLink.textContent = "Sair";
        loginLink.href = "#";

        loginLink.addEventListener("click", (event) => {

            event.preventDefault();

            localStorage.removeItem("ledpedestre_session");

            window.location.href = "index.html";
        });
    }

});