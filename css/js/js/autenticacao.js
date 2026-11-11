
const USERS_KEY = "ledpedestre_users";
const SESSION_KEY = "ledpedestre_session";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function showMessage(message, success = false) {
    const box = document.getElementById("form-message");

    if (box) {
        box.textContent = message;
        box.style.color = success ? "green" : "red";
    }
}

async function hashPassword(password, salt) {

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 150000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(bits))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function encodeSalt(bytes) {
    return btoa(String.fromCharCode(...bytes));
}

function decodeSalt(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm-password").value;

        if (password.length < 8) {
            return showMessage("A senha precisa ter pelo menos 8 caracteres.");
        }

        if (password !== confirm) {
            return showMessage("As senhas não coincidem.");
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            return showMessage("Este e-mail já está cadastrado.");
        }

        try {

            const salt = crypto.getRandomValues(new Uint8Array(16));
            const passwordHash = await hashPassword(password, salt);

            users.push({
                name,
                email,
                salt: encodeSalt(salt),
                passwordHash
            });

            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            showMessage("Cadastro realizado com sucesso!", true);

            registerForm.reset();

        } catch {
            showMessage("Erro ao realizar cadastro. Execute em localhost ou HTTPS.");
        }

    });
}

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const user = getUsers().find(user => user.email === email);

        if (!user) {
            return showMessage("E-mail ou senha incorretos.");
        }

        try {

            const hash = await hashPassword(password, decodeSalt(user.salt));

            if (hash !== user.passwordHash) {
                return showMessage("E-mail ou senha incorretos.");
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify({
                name: user.name,
                email: user.email
            }));

            showMessage("Login realizado com sucesso!", true);

            setTimeout(() => {
                window.location.href = "mapa.html";
            }, 700);

        } catch {
            showMessage("Erro ao verificar login.");
        }

    });
}