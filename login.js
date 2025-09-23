// Script de login/cadastro básico (captura de dados)
document.addEventListener("DOMContentLoaded", () => {
    // Injeta CSS do spinner
    const style = document.createElement("style")
    style.textContent = `
    .login-btn { position: relative; }
    .login-btn.is-loading { pointer-events: none; opacity: 0.8; }
    .login-btn.is-loading span { visibility: hidden; }
    .login-btn.is-loading::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 18px;
        height: 18px;
        margin: -9px 0 0 -9px;
        border: 2px solid rgba(255,255,255,0.6);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    `
    document.head.appendChild(style)

    // helper para estado de carregando no botão do formulário
    const setLoading = (formEl, isLoading) => {
        const btn = formEl.querySelector(".login-btn")
        if (!btn) return
        if (isLoading) {
            // garante um span para preservar layout do texto
            if (!btn.querySelector("span")) {
                const span = document.createElement("span")
                span.textContent = btn.textContent
                btn.textContent = ""
                btn.appendChild(span)
            }
            btn.classList.add("is-loading")
            btn.disabled = true
        } else {
            btn.classList.remove("is-loading")
            btn.disabled = false
        }
    }
    const API_BASE = "http://localhost:3001";

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            try {
                setLoading(loginForm, true)
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || "Erro no login");
                localStorage.setItem("token", data.token);
                window.location.href = "index.html";
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(loginForm, false)
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            const confirmpassword = document.getElementById("confirmPassword").value;
            try {
                setLoading(registerForm, true)
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, confirmpassword })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || "Erro no cadastro");
                alert("Cadastro realizado! Agora faça login.");
                // opcional: rolar até o form de login
                document.getElementById("email").focus();
            } catch (err) {
                alert(err.message);
            } finally {
                setLoading(registerForm, false)
            }
        });
    }
});
