function renderReportes(section, title, content) {
    const titles = {
        'reporte-cliente': 'Reportes - Por Cliente',
        'envios-salida': 'Reportes - Envíos de Salida',
        'envios-llegada': 'Reportes - Envíos de Llegada',
        'reporte-asignados': 'Reportes - Asignados',
        'reporte-ventas': 'Reportes - Ventas'
    };
    title.innerText = titles[section] || 'Reportes';
    content.innerHTML = `<div class="card p-4"><h5>${titles[section]}</h5><p>Métricas y reportes detallados.</p></div>`;
}