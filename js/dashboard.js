// js/dashboard.js - Enrutador principal corregido

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();

    // Iniciar en blanco (pantalla de bienvenida vacía)
    mostrarPantallaInicial();
});

function mostrarPantallaInicial() {
    const contenedor = document.getElementById('dynamic-content');
    const titulo = document.getElementById('tituloPagina');
    if (titulo) titulo.textContent = 'Bienvenido al Sistema';
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 py-5 text-muted">
                <i class="fa-solid fa-box-archive display-1 mb-3 text-secondary opacity-50"></i>
                <h3>Bienvenido al Sistema de Ventas y Courier</h3>
                <p>Seleccione un módulo del menú lateral para comenzar a trabajar.</p>
            </div>
        `;
    }
}

function inicializarNavegacion() {
    const enlaces = document.querySelectorAll('.item-menu');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const accion = enlace.getAttribute('data-accion');

            // Resaltar ítem activo
            enlaces.forEach(el => el.classList.remove('text-white', 'fw-bold', 'bg-primary'));
            enlaces.forEach(el => el.classList.add('text-white-50'));

            if (accion !== 'cerrar-sesion' && accion !== 'cambiar-cuenta') {
                enlace.classList.remove('text-white-50');
                enlace.classList.add('text-white', 'fw-bold', 'bg-primary');
            }

            cargarModulo(accion);
        });
    });
}

function cargarModulo(accion) {
    const contenedor = document.getElementById('dynamic-content');
    const titulo = document.getElementById('tituloPagina');
    if (!contenedor) return;

    switch (accion) {
        // MAESTROS
        case 'crear-usuarios':
        case 'eliminar-usuarios':
            if (titulo) titulo.textContent = `Maestros / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(window.renderMaestros, accion, 'Maestros', contenedor);
            break;

        case 'clientes':
            if (titulo) titulo.textContent = 'Maestros / Gestión de Clientes';
            ejecutarModulo(window.renderClientes, accion, 'Clientes', contenedor);
            break;

        // TARIFAS
        case 'tarifario':
            if (titulo) titulo.textContent = 'Tarifas / Tarifario';
            ejecutarModulo(window.renderTarifas, accion, 'Tarifas', contenedor);
            break;

        // DESPACHOS
        case 'registrar-despacho':
        case 'guia-despacho':
            if (titulo) titulo.textContent = `Despachos / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(window.renderDespachos, accion, 'Despachos', contenedor);
            break;

        // DISTRIBUCIÓN
        case 'recepcion':
        case 'asignacion':
        case 'devolucion':
        case 'coordinacion':
            if (titulo) titulo.textContent = `Distribución / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(window.renderDistribucion, accion, 'Distribución', contenedor);
            break;

        // REPORTES
        case 'reporte-cliente':
        case 'reporte-envios':
        case 'reporte-salida':
        case 'reporte-llegada':
        case 'reporte-asignados':
            if (titulo) titulo.textContent = `Reportes / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(window.renderReportes, accion, 'Reportes', contenedor);
            break;

        // VENTAS
        case 'venta':
        case 'emision-comprobantes':
            if (titulo) titulo.textContent = `Ventas / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(window.renderVentas, accion, 'Ventas', contenedor);
            break;

        // OPCIONES DE CUENTA
        case 'cambiar-cuenta':
            if (confirm('¿Desea cambiar de cuenta de usuario?')) {
                window.location.href = 'index.html';
            }
            break;

        case 'cerrar-sesion':
            if (confirm('¿Está seguro de cerrar sesión?')) {
                window.location.href = 'index.html';
            }
            break;

        default:
            contenedor.innerHTML = '<div class="alert alert-warning">Opción no encontrada.</div>';
            break;
    }
}

function ejecutarModulo(fnRender, accion, nombreModulo, contenedor) {
    if (typeof fnRender === 'function') {
        fnRender(accion);
    } else {
        contenedor.innerHTML = `<div class="alert alert-danger">El módulo de ${nombreModulo} no está disponible o no se cargó correctamente.</div>`;
    }
}

function obtenerTextoTitulo(accion) {
    const titulos = {
        'crear-usuarios': 'Crear Usuarios',
        'eliminar-usuarios': 'Eliminar Usuarios',
        'registrar-despacho': 'Registrar envíos para despacho',
        'guia-despacho': 'Guía de Despacho',
        'recepcion': 'Recepción',
        'asignacion': 'Asignación',
        'devolucion': 'Devolución',
        'coordinacion': 'Coordinación',
        'reporte-cliente': 'Por Cliente',
        'reporte-envios': 'Envíos',
        'reporte-salida': 'Salida',
        'reporte-llegada': 'Llegada',
        'reporte-asignados': 'Asignados',
        'venta': 'Venta',
        'emision-comprobantes': 'Emisión de Comprobantes'
    };
    return titulos[accion] || '';
}