function renderDistribucion(section, title, content) {
    switch (section) {
        case 'recepcion':
            title.innerText = 'Distribución - Recepción';
            content.innerHTML = `<div class="card p-4"><h5>Recepción de Paquetes en Almacén</h5></div>`;
            break;
        case 'asignacion':
            title.innerText = 'Distribución - Asignación';
            content.innerHTML = `<div class="card p-4"><h5>Asignación de Envíos a Mensajeros</h5></div>`;
            break;
        case 'devolucion':
            title.innerText = 'Distribución - Devolución';
            content.innerHTML = `<div class="card p-4"><h5>Gestión de Devoluciones</h5></div>`;
            break;
        case 'coordinacion':
            title.innerText = 'Distribución - Coordinación';
            content.innerHTML = `<div class="card p-4"><h5>Panel de Coordinación Logística</h5></div>`;
            break;
    }
}