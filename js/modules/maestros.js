function renderMaestros(section, title, content) {
    if (section === 'crear-usuario') {
        title.innerText = 'Maestros - Crear Usuario';
        content.innerHTML = `
            <div class="card p-4">
                <h5 class="mb-3">Registrar Nuevo Usuario</h5>
                <form onsubmit="event.preventDefault(); alert('Usuario Creado');">
                    <div class="mb-3">
                        <label class="form-label">Nombre Completo</label>
                        <input type="text" class="form-control" placeholder="Ej. Juan Pérez" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" class="form-control" placeholder="correo@ejemplo.com" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Usuario</button>
                </form>
            </div>`;
    } else if (section === 'eliminar-usuario') {
        title.innerText = 'Maestros - Eliminar Usuario';
        content.innerHTML = `
            <div class="card p-4">
                <h5>Lista de Usuarios</h5>
                <table class="table table-striped mt-3">
                    <thead><tr><th>ID</th><th>Nombre</th><th>Acción</th></tr></thead>
                    <tbody>
                        <tr><td>1</td><td>Juan Pérez</td><td><button class="btn btn-sm btn-danger" onclick="alert('Usuario eliminado')">Eliminar</button></td></tr>
                    </tbody>
                </table>
            </div>`;
    }
}