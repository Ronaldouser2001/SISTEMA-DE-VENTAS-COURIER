// Validar inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorAlert = document.getElementById('login-error');

    if (user === 'admin' && pass === 'admin') {
        localStorage.setItem('currentUser', user);
        window.location.href = 'dashboard.html';
    } else {
        errorAlert.classList.remove('d-none');
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Cambiar de cuenta
function switchAccount() {
    logout();
}

// Verificar sesión al cargar dashboard.html
document.addEventListener('DOMContentLoaded', () => {
    const userBadge = document.getElementById('user-badge');
    if (userBadge) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            window.location.href = 'index.html';
        } else {
            userBadge.innerText = `Usuario: ${currentUser}`;
        }
    }
});