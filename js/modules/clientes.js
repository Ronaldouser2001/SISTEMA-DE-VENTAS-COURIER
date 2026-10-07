const API_CLIENTES_URL = 'http://localhost:5211/api/clientes';
const API_TARIFAS_URL = 'http://localhost:5211/api/tarifas';

let clientesMemoria = [];
let paquetesDisponibles = [];

// Función principal llamada por dashboard.js
async function renderClientes() {
    const contenedor = document.getElementById('dynamic-content');
    if (!contenedor) return;

    // Inyectamos el HTML de la vista
    contenedor.innerHTML = `
        <div class="container-fluid p-0">
            <!-- Formulario -->
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white fw-bold">
                    <i class="fa-solid fa-user-plus me-1"></i> Registro y Edición de Clientes
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-2">
                            <label class="form-label fw-bold">Tipo Doc.</label>
                            <select id="cboTipoDoc" class="form-select">
                                <option value="DNI">DNI</option>
                                <option value="RUC">RUC</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-bold">N° Documento *</label>
                            <input type="text" id="txtNumDoc" class="form-control" placeholder="Ej: 20100047218">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold">Nombre / Razón Social *</label>
                            <input type="text" id="txtNombreCliente" class="form-control" placeholder="Ej: BANCO DE CREDITO DEL PERU">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-bold">Teléfono</label>
                            <input type="text" id="txtTelefonoCliente" class="form-control" placeholder="Ej: 987654321">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold">Correo Electrónico</label>
                            <input type="email" id="txtCorreoCliente" class="form-control" placeholder="cliente@correo.com">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold">Dirección</label>
                            <input type="text" id="txtDireccionCliente" class="form-control" placeholder="Av. Principal 123">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-bold text-success">Paquete Tarifario Asignado</label>
                            <select id="cboPaqueteCliente" class="form-select border-success">
                                <!-- Opciones cargadas dinámicamente -->
                            </select>
                        </div>
                    </div>
                    <div class="mt-3 text-end">
                        <button class="btn btn-secondary me-2" onclick="limpiarFormularioCliente()">Limpiar</button>
                        <button class="btn btn-primary fw-bold" onclick="guardarCliente()">
                            <i class="fa-solid fa-floppy-disk me-1"></i> Guardar Cliente
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tabla de Clientes -->
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fa-solid fa-magnifying-glass"></i></span>
                                <input type="text" class="form-control" placeholder="Buscar por DNI, RUC o Nombre..." onkeyup="obtenerClientesAPI(this.value)">
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre / Razón Social</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Paquete Tarifario</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyClientes">
                                <tr><td colspan="6" class="text-center py-3">Cargando clientes...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar combos y listado tras inyectar el HTML
    await cargarPaquetesEnCombo();
    await obtenerClientesAPI();
}

async function cargarPaquetesEnCombo() {
    try {
        const res = await fetch(API_TARIFAS_URL);
        if (res.ok) {
            const data = await res.json();
            paquetesDisponibles = data.map(p => p.nombre);
        }
    } catch (err) {
        paquetesDisponibles = [];
    }

    const cbo = document.getElementById('cboPaqueteCliente');
    if (cbo) {
        cbo.innerHTML = '<option value="">-- REGULAR (Por Defecto) --</option>' +
            paquetesDisponibles
                .filter(nombre => !nombre.toLowerCase().includes('regular'))
                .map(nombre => `<option value="${nombre}">${nombre}</option>`)
                .join('');
    }
}

async function obtenerClientesAPI(criterio = '') {
    try {
        const res = await fetch(`${API_CLIENTES_URL}?buscar=${encodeURIComponent(criterio)}`);
        if (res.ok) {
            clientesMemoria = await res.json();
            renderizarTablaClientes();
        }
    } catch (err) {
        console.error("Error al obtener la lista de clientes:", err);
    }
}

function renderizarTablaClientes() {
    const tbody = document.getElementById('tbodyClientes');
    if (!tbody) return;

    if (clientesMemoria.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted fw-bold">No hay clientes registrados.</td></tr>';
        return;
    }

    tbody.innerHTML = clientesMemoria.map(c => `
        <tr>
            <td><span class="badge bg-secondary">${c.tipoDocumento}</span> <strong>${c.numeroDocumento}</strong></td>
            <td class="fw-bold text-dark">${c.nombreRazonSocial}</td>
            <td>${c.telefono || '-'}</td>
            <td>${c.direccion || '-'}</td>
            <td>
                ${c.nombrePaqueteTarifario 
                    ? `<span class="badge bg-success fs-6">${c.nombrePaqueteTarifario}</span>` 
                    : `<span class="badge bg-primary fs-6">REGULAR (Por Defecto)</span>`}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary fw-bold" onclick="cargarFormularioEdicion('${c.numeroDocumento}')">
                    <i class="fa-solid fa-pen-to-square me-1"></i> Editar
                </button>
            </td>
        </tr>
    `).join('');
}

function cargarFormularioEdicion(numDoc) {
    const cliente = clientesMemoria.find(c => c.numeroDocumento === numDoc);
    if (!cliente) return;

    document.getElementById('cboTipoDoc').value = cliente.tipoDocumento;
    document.getElementById('txtNumDoc').value = cliente.numeroDocumento;
    document.getElementById('txtNombreCliente').value = cliente.nombreRazonSocial;
    document.getElementById('txtTelefonoCliente').value = cliente.telefono || '';
    document.getElementById('txtCorreoCliente').value = cliente.correo || '';
    document.getElementById('txtDireccionCliente').value = cliente.direccion || '';
    document.getElementById('cboPaqueteCliente').value = cliente.nombrePaqueteTarifario || '';
}

async function guardarCliente() {
    const clienteData = {
        tipoDocumento: document.getElementById('cboTipoDoc').value,
        numeroDocumento: document.getElementById('txtNumDoc').value.trim(),
        nombreRazonSocial: document.getElementById('txtNombreCliente').value.trim(),
        telefono: document.getElementById('txtTelefonoCliente').value.trim(),
        correo: document.getElementById('txtCorreoCliente').value.trim(),
        direccion: document.getElementById('txtDireccionCliente').value.trim(),
        nombrePaqueteTarifario: document.getElementById('cboPaqueteCliente').value || null
    };

    if (!clienteData.numeroDocumento || !clienteData.nombreRazonSocial) {
        alert("Por favor complete el Número de Documento y Nombre/Razón Social.");
        return;
    }

    try {
        const res = await fetch(API_CLIENTES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clienteData)
        });

        if (res.ok) {
            alert("Cliente guardado correctamente.");
            limpiarFormularioCliente();
            obtenerClientesAPI();
        }
    } catch (err) {
        alert("Error de conexión al guardar el cliente.");
    }
}

function limpiarFormularioCliente() {
    document.getElementById('txtNumDoc').value = '';
    document.getElementById('txtNombreCliente').value = '';
    document.getElementById('txtTelefonoCliente').value = '';
    document.getElementById('txtCorreoCliente').value = '';
    document.getElementById('txtDireccionCliente').value = '';
    document.getElementById('cboPaqueteCliente').value = '';
}

window.renderClientes = renderClientes;