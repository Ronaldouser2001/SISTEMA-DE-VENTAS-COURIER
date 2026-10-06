// js/dashboard.js - Enrutador principal según estructura oficial

document.addEventListener('DOMContentLoaded', () => {
    inicializarNavegacion();

    // Cargar la vista predeterminada al ingresar
    cargarModulo('tarifario');
});

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
            titulo.textContent = `Maestros / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(renderMaestros, accion, 'Maestros (js/modules/maestros.js)', contenedor);
            break;

        case 'clientes':
            titulo.textContent = 'Maestros / Gestión de Clientes';
            ejecutarModulo(renderClientes, accion, 'Clientes (js/modules/clientes.js)', contenedor);
            break;

        // TARIFAS
        case 'tarifario':
            titulo.textContent = 'Tarifas / Tarifario';
            ejecutarModulo(renderTarifas, accion, 'Tarifas (js/modules/tarifas.js)', contenedor);
            break;

        // DESPACHOS
        case 'registrar-despacho':
        case 'guia-despacho':
            titulo.textContent = `Despachos / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(renderDespachos, accion, 'Despachos (js/modules/despachos.js)', contenedor);
            break;

        // DISTRIBUCIÓN
        case 'recepcion':
        case 'asignacion':
        case 'devolucion':
        case 'coordinacion':
            titulo.textContent = `Distribución / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(renderDistribucion, accion, 'Distribución (js/modules/distribucion.js)', contenedor);
            break;

        // REPORTES
        case 'reporte-cliente':
        case 'reporte-envios':
        case 'reporte-salida':
        case 'reporte-llegada':
        case 'reporte-asignados':
            titulo.textContent = `Reportes / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(renderReportes, accion, 'Reportes (js/modules/reportes.js)', contenedor);
            break;

        // VENTAS
        case 'venta':
        case 'emision-comprobantes':
            titulo.textContent = `Ventas / ${obtenerTextoTitulo(accion)}`;
            ejecutarModulo(renderVentas, accion, 'Ventas (js/modules/ventas.js)', contenedor);
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