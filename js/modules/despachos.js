function renderDespachos(section, title, content) {
    if (section === 'registrar-envios') {
        title.innerText = 'Despachos - Registrar Envíos';
        content.innerHTML = `
            <div class="card p-4">
                <h5>Registro de Orden para Despacho</h5>
                <form onsubmit="event.preventDefault(); alert('Envío registrado');">
                    <div class="mb-3"><label class="form-label">Destinatario</label><input type="text" class="form-control" required></div>
                    <button type="submit" class="btn btn-success">Registrar Envío</button>
                </form>
            </div>`;
    } else if (section === 'guia-despacho') {
        title.innerText = 'Despachos - Guía de Despacho';
        content.innerHTML = `<div class="card p-4"><h5>Generación de Guía de Despacho</h5></div>`;
    }
}

