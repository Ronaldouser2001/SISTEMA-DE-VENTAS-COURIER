// js/router.js

function navigate(modulo, accion) {
    const sectionTitle = document.getElementById('section-title');
    const dynamicContent = document.getElementById('dynamic-content');

    if (!dynamicContent) return;

    switch (modulo) {
        case 'tarifas':
            if (sectionTitle) sectionTitle.textContent = 'Módulo de Tarifarios y Zonas';
            if (typeof window.renderTarifas === 'function') {
                window.renderTarifas(accion);
            } else {
                dynamicContent.innerHTML = `<div class="alert alert-warning">Cargando módulo de tarifas...</div>`;
            }
            break;

        case 'maestros':
            if (sectionTitle) sectionTitle.textContent = 'Gestión de Maestros';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Módulo de Maestros: ${accion}</h4></div>`;
            break;

        case 'despachos':
            if (sectionTitle) sectionTitle.textContent = 'Gestión de Despachos';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Módulo de Despachos: ${accion}</h4></div>`;
            break;

        case 'distribucion':
            if (sectionTitle) sectionTitle.textContent = 'Gestión de Distribución';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Módulo de Distribución: ${accion}</h4></div>`;
            break;

        case 'reportes':
            if (sectionTitle) sectionTitle.textContent = 'Reportes e Indicadores';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Módulo de Reportes: ${accion}</h4></div>`;
            break;

        case 'ventas':
            if (sectionTitle) sectionTitle.textContent = 'Gestión de Ventas';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Módulo de Ventas: ${accion}</h4></div>`;
            break;

        default:
            if (sectionTitle) sectionTitle.textContent = 'Panel de Control';
            dynamicContent.innerHTML = `<div class="card p-4"><h4>Bienvenido al Sistema de Ventas y Courier</h4></div>`;
            break;
    }
}

// Registro global
window.navigate = navigate;