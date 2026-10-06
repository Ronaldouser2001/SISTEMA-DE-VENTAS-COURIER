// js/modules/tarifas.js - Adaptación exacta del Módulo Tarifas Aprobado

const API_CIUDADES_URL = 'http://localhost:5211/api/ciudades';
const API_CLIENTES_URL = 'http://localhost:5211/api/clientes';
const API_BASE_URL = 'http://localhost:5211/api';

let listaCiudadesAPI = [];
let accionPendienteConfirmacion = null;
let modalConfirmacionBS = null;
let modalVistaPreviaBS = null;

// ESTRUCTURA DE DATOS APROBADA
let paquetesBD = [
    {
        id: 'PAQ-001',
        nombre: 'Tarifa Regular General',
        tipo: 'REGULAR',
        cliente: 'General (Todos)',
        sobreBase: 10.00,
        sobreExceso: 2.00,
        cajaBase: 13.00,
        cajaExceso: 5.00,
        zonas: [
            { id: 1, nombre: 'Zona Local Huancayo', sla: '24 Horas', distritosIds: ['120101', '120107', '120114'] },
            { id: 2, nombre: 'Zona Selva Chanchamayo', sla: '48 Horas', distritosIds: ['120301', '120302'] }
        ]
    },
    {
        id: 'PAQ-002',
        nombre: 'Tarifa Corporativa BCP',
        tipo: 'PERSONALIZADO',
        cliente: 'Banco de Crédito del Perú (RUC: 20100047218)',
        sobreBase: 8.50,
        sobreExceso: 1.50,
        cajaBase: 11.00,
        cajaExceso: 3.50,
        zonas: [
            { id: 101, nombre: 'Zona Lima Metropolitana', sla: '24 a 48 Horas', distritosIds: ['150101', '150122'] }
        ]
    }
];

let paqueteActivoId = 'PAQ-001';
let zonaActivaId = 1;

// CARGA DE FONT AWESOME SI NO EXISTE
function asegurarFontAwesome() {
    if (!document.getElementById('fontawesome-css')) {
        const link = document.createElement('link');
        link.id = 'fontawesome-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(link);
    }
}

// RENDERIZADO EN EL PANEL PRINCIPAL (#dynamic-content)
async function renderTarifas(subAccion = 'tarifas') {
    asegurarFontAwesome();
    const container = document.getElementById('dynamic-content');
    if (!container) return;

    container.innerHTML = `
        <!-- BOTÓN FLOTANTE GUARDAR -->
        <div class="btn-flotante-guardar">
            <button class="btn btn-success btn-lg fw-bold rounded-pill px-4 py-3 text-white d-flex align-items-center gap-2" id="btnGuardarTodo">
                <i class="fa-solid fa-floppy-disk fs-5"></i>
                <span>Guardar Cambios</span>
            </button>
        </div>

        <!-- ENCABEZADO DEL MÓDULO -->
        <div class="d-flex justify-content-between align-items-center bg-dark text-white p-3 rounded mb-4 shadow">
            <h4 class="mb-0 fw-bold">
                <i class="fa-solid fa-truck-ram text-warning me-2"></i>Módulo de Configuración Tarifaria
            </h4>
            <div class="d-flex gap-2 align-items-center">
                <button class="btn btn-outline-light fw-bold" id="btnAbrirVistaPrevia">
                    <i class="fa-solid fa-print me-1"></i> Vista Previa / PDF
                </button>
                <span class="badge bg-primary px-3 py-2 fs-6">Sistema Accesible</span>
            </div>
        </div>

        <!-- BLOQUE 1: GESTIÓN DE PAQUETE TARIFARIO Y CLIENTE -->
        <div class="bloque-seccion">
            <div class="bloque-header header-azul">
                <span><span class="btn-paso">1</span>Gestión del Paquete Tarifario y Cliente</span>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-light fw-bold text-dark" id="btnNuevoPaquete">
                        <i class="fa-solid fa-plus me-1 text-success"></i>Nuevo Paquete
                    </button>
                    <button class="btn btn-sm btn-outline-danger bg-white fw-bold" id="btnEliminarPaquete">
                        <i class="fa-solid fa-trash me-1 text-danger"></i>Eliminar Paquete
                    </button>
                </div>
            </div>
            <div class="card-body p-4 bg-light">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label fw-bold text-dark">Paquete Tarifario Activo:</label>
                        <select id="cboPaquetes" class="form-select form-select-lg fw-bold border-2"></select>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label fw-bold text-dark">Nombre del Paquete:</label>
                        <input type="text" id="txtNombrePaquete" class="form-control form-control-lg border-2">
                    </div>

                    <div class="col-md-3">
                        <label class="form-label fw-bold text-dark">Tipo de Tarifario:</label>
                        <select id="cboTipoPaquete" class="form-select form-select-lg border-2">
                            <option value="REGULAR">REGULAR (General)</option>
                            <option value="PERSONALIZADO">PERSONALIZADO (Por Cliente)</option>
                        </select>
                    </div>

                    <div class="col-md-3 position-relative">
                        <label class="form-label fw-bold text-dark">Asignar Cliente (DNI / RUC / Nombre):</label>
                        <div class="input-group">
                            <span class="input-group-text bg-white border-2"><i class="fa-solid fa-id-card text-primary"></i></span>
                            <input type="text" id="txtBuscarCliente" class="form-control form-control-lg border-2" placeholder="Buscar cliente...">
                        </div>
                        <div id="listaResultadosCliente" class="list-group position-absolute shadow mt-1 w-100" style="z-index: 1000;"></div>
                        <small class="text-muted fw-bold d-block mt-1" id="lblClienteAsignado">Cliente actual: General</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- BLOQUE 2: ESTRUCTURA DE PRECIOS Y ADICIONALES -->
        <div class="bloque-seccion">
            <div class="bloque-header header-gris">
                <span><span class="btn-paso">2</span>Precios Base y Servicios Adicionales</span>
            </div>
            <div class="card-body p-4 bg-white">
                <div class="row g-4 align-items-center">
                    
                    <!-- PRECIO SOBRES -->
                    <div class="col-md-3">
                        <div class="p-3 border border-2 border-primary rounded bg-white">
                            <span class="fw-bold d-block text-primary mb-2"><i class="fa-solid fa-envelope me-2"></i>Sobres (Base hasta 1.5 kg)</span>
                            <div class="input-group mb-2">
                                <span class="input-group-text fw-bold">S/</span>
                                <input type="number" id="numSobreBase" class="form-control fw-bold" step="0.50">
                            </div>
                            <span class="small fw-bold text-muted">Costo por kg Adicional:</span>
                            <div class="input-group mt-1">
                                <span class="input-group-text">+ S/</span>
                                <input type="number" id="numSobreExceso" class="form-control" step="0.50">
                            </div>
                        </div>
                    </div>

                    <!-- PRECIO CAJAS -->
                    <div class="col-md-3">
                        <div class="p-3 border border-2 border-primary rounded bg-white">
                            <span class="fw-bold d-block text-primary mb-2"><i class="fa-solid fa-box me-2"></i>Cajas / Paquetes (Base 1.5 kg)</span>
                            <div class="input-group mb-2">
                                <span class="input-group-text fw-bold">S/</span>
                                <input type="number" id="numCajaBase" class="form-control fw-bold" step="0.50">
                            </div>
                            <span class="small fw-bold text-muted">Costo por kg Adicional:</span>
                            <div class="input-group mt-1">
                                <span class="input-group-text">+ S/</span>
                                <input type="number" id="numCajaExceso" class="form-control" step="0.50">
                            </div>
                        </div>
                    </div>

                    <!-- ADICIONALES -->
                    <div class="col-md-6">
                        <div class="p-3 border border-2 border-secondary rounded bg-white">
                            <span class="fw-bold d-block text-dark mb-2"><i class="fa-solid fa-bell-concierge me-2"></i>Servicios Opcionales Incluidos:</span>
                            <div class="d-flex flex-wrap gap-4 pt-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input fs-5" type="checkbox" id="chkSeguro" checked>
                                    <label class="form-check-label fw-bold mt-1" for="chkSeguro">Seguro de Envíos</label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input fs-5" type="checkbox" id="chkCargo" checked>
                                    <label class="form-check-label fw-bold mt-1" for="chkCargo">Cargo Adjunto</label>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input fs-5" type="checkbox" id="chkEmbalaje">
                                    <label class="form-check-label fw-bold mt-1" for="chkEmbalaje">Embalaje Especial</label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- BLOQUE 3: ZONAS TARIFARIAS, SLA Y DUAL-BOX -->
        <div class="bloque-seccion mb-5">
            <div class="bloque-header header-verde">
                <span><span class="btn-paso">3</span>Zonas Tarifarias, SLA de Entrega y Asignación de Ciudades</span>
                <span class="badge bg-light text-dark fs-6" id="lblTotalAsignados">0 Ciudades Asignadas</span>
            </div>

            <div class="card-body p-4 bg-white">

                <!-- CONTROLES ZONA Y SLA -->
                <div class="row g-3 align-items-center mb-4 p-3 border border-2 rounded bg-light">
                    <div class="col-md-4">
                        <label class="form-label fw-bold text-dark">Zona Tarifaria Seleccionada:</label>
                        <select id="cboZonas" class="form-select form-select-lg border-2 fw-bold"></select>
                    </div>

                    <div class="col-md-3">
                        <label class="form-label fw-bold text-dark">Nombre de la Zona:</label>
                        <input type="text" id="txtNombreZona" class="form-control form-control-lg border-2">
                    </div>

                    <div class="col-md-3">
                        <label class="form-label fw-bold text-dark">Tiempo de Entrega (SLA):</label>
                        <input type="text" id="txtSlaZona" class="form-control form-control-lg border-2" placeholder="Ej: 24 a 48 Horas">
                    </div>

                    <div class="col-md-2 d-flex flex-column gap-1 pt-2">
                        <button class="btn btn-success fw-bold" id="btnCrearZona">
                            <i class="fa-solid fa-plus me-1"></i> Nueva Zona
                        </button>
                        <button class="btn btn-outline-danger btn-sm fw-bold bg-white" id="btnEliminarZona">
                            <i class="fa-solid fa-trash me-1"></i> Eliminar Zona
                        </button>
                    </div>
                </div>

                <!-- FILTROS -->
                <div class="row g-3 mb-4 p-3 bg-white border border-2 rounded">
                    <div class="col-md-4">
                        <label class="form-label small fw-bold text-uppercase text-secondary">Departamento</label>
                        <select id="cboDepartamento" class="form-select border-2">
                            <option value="">-- Todos los Departamentos --</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-bold text-uppercase text-secondary">Provincia</label>
                        <select id="cboProvincia" class="form-select border-2">
                            <option value="">-- Todas las Provincias --</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-bold text-uppercase text-secondary">Buscar Distrito</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light border-2"><i class="fa-solid fa-magnifying-glass"></i></span>
                            <input type="text" id="txtBuscar" class="form-control border-2" placeholder="Escriba para filtrar...">
                        </div>
                    </div>
                </div>

                <!-- COLUMNAS DUAL BOX -->
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="p-3 border border-2 rounded bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-2">
                                <h6 class="fw-bold mb-0 text-dark"><i class="fa-solid fa-list-ul me-2 text-primary"></i>Ciudades Disponibles</h6>
                                <button class="btn btn-sm btn-outline-primary fw-bold" id="btnAgregarVisibles">
                                    <i class="fa-solid fa-forward me-1"></i> Añadir Filtro
                                </button>
                            </div>
                            <div class="box-ciudades" id="boxDisponibles"></div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="p-3 border border-2 rounded bg-white">
                            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-2">
                                <h6 class="fw-bold mb-0 text-success"><i class="fa-solid fa-circle-check me-2"></i>Ciudades en la Zona Activa</h6>
                                <button class="btn btn-sm btn-outline-danger fw-bold" id="btnVaciarZona">
                                    <i class="fa-solid fa-trash me-1"></i> Vaciar Zona
                                </button>
                            </div>
                            <div class="box-ciudades" id="boxAsignados"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- MODAL DE CONFIRMACIÓN -->
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-2 border-danger">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-header-title fw-bold mb-0" id="lblTituloConfirmacion"><i class="fa-solid fa-circle-exclamation me-2"></i>Confirmar Acción</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 fs-5" id="lblMensajeConfirmacion">
                        ¿Está seguro de realizar esta acción?
                    </div>
                    <div class="modal-footer bg-light">
                        <button type="button" class="btn btn-secondary btn-lg fw-bold" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger btn-lg fw-bold" id="btnEjecutarConfirmacion">Sí, Continuar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DE VISTA PREVIA Y PDF -->
        <div class="modal fade" id="modalVistaPrevia" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white no-print">
                        <h5 class="modal-title fw-bold"><i class="fa-solid fa-file-pdf me-2 text-warning"></i>Vista Previa del Tarifario</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4" id="seccionImprimible"></div>
                    <div class="modal-footer bg-light no-print">
                        <button type="button" class="btn btn-secondary fw-bold" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" class="btn btn-primary fw-bold" id="btnImprimirPDF">
                            <i class="fa-solid fa-print me-1"></i> Imprimir / Guardar como PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar Modales
    modalConfirmacionBS = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modalVistaPreviaBS = new bootstrap.Modal(document.getElementById('modalVistaPrevia'));

    // Configurar Eventos
    vincularEventos();

    // Cargar Datos Iniciales
    await obtenerCiudades();
}

// -------------------------------------------------------------
// EVENTOS Y EVENT LISTENERS
// -------------------------------------------------------------
function vincularEventos() {
    document.getElementById('btnGuardarTodo')?.addEventListener('click', guardarTodo);
    document.getElementById('btnAbrirVistaPrevia')?.addEventListener('click', abrirVistaPreviaModal);
    document.getElementById('btnImprimirPDF')?.addEventListener('click', () => window.print());

    document.getElementById('btnNuevoPaquete')?.addEventListener('click', nuevoPaquete);
    document.getElementById('btnEliminarPaquete')?.addEventListener('click', pedirConfirmacionEliminarPaquete);

    document.getElementById('cboPaquetes')?.addEventListener('change', cambiarPaqueteActivo);
    document.getElementById('txtNombrePaquete')?.addEventListener('keyup', actualizarNombrePaquete);
    document.getElementById('cboTipoPaquete')?.addEventListener('change', actualizarTipoPaquete);

    document.getElementById('txtBuscarCliente')?.addEventListener('keyup', (e) => buscarClienteAPI(e.target.value));

    document.getElementById('numSobreBase')?.addEventListener('change', guardarPreciosEnMemoria);
    document.getElementById('numSobreExceso')?.addEventListener('change', guardarPreciosEnMemoria);
    document.getElementById('numCajaBase')?.addEventListener('change', guardarPreciosEnMemoria);
    document.getElementById('numCajaExceso')?.addEventListener('change', guardarPreciosEnMemoria);

    document.getElementById('cboZonas')?.addEventListener('change', cambiarZonaActiva);
    document.getElementById('txtNombreZona')?.addEventListener('keyup', actualizarNombreZona);
    document.getElementById('txtSlaZona')?.addEventListener('keyup', actualizarSlaZona);

    document.getElementById('btnCrearZona')?.addEventListener('click', crearNuevaZona);
    document.getElementById('btnEliminarZona')?.addEventListener('click', pedirConfirmacionEliminarZona);

    document.getElementById('cboDepartamento')?.addEventListener('change', cargarProvincias);
    document.getElementById('cboProvincia')?.addEventListener('change', refrescarListas);
    document.getElementById('txtBuscar')?.addEventListener('keyup', refrescarListas);

    document.getElementById('btnAgregarVisibles')?.addEventListener('click', agregarTodasLasVisibles);
    document.getElementById('btnVaciarZona')?.addEventListener('click', pedirConfirmacionVaciarZona);

    document.getElementById('btnEjecutarConfirmacion')?.addEventListener('click', () => {
        if (accionPendienteConfirmacion) {
            accionPendienteConfirmacion();
            accionPendienteConfirmacion = null;
        }
        modalConfirmacionBS.hide();
    });
}

// -------------------------------------------------------------
// CARGA DE CIUDADES Y DATOS INICIALES
// -------------------------------------------------------------
async function obtenerCiudades() {
    try {
        const res = await fetch(API_CIUDADES_URL);
        if (!res.ok) throw new Error();
        listaCiudadesAPI = await res.json();
    } catch (err) {
        listaCiudadesAPI = [
            { id: "120101", departamento: "JUNIN", provincia: "HUANCAYO", distrito: "HUANCAYO" },
            { id: "120107", departamento: "JUNIN", provincia: "HUANCAYO", distrito: "CHILCA" },
            { id: "120114", departamento: "JUNIN", provincia: "HUANCAYO", distrito: "EL TAMBO" },
            { id: "120301", departamento: "JUNIN", provincia: "CHANCHAMAYO", distrito: "CHANCHAMAYO" },
            { id: "120302", departamento: "JUNIN", provincia: "CHANCHAMAYO", distrito: "PERENE" },
            { id: "120303", departamento: "JUNIN", provincia: "CHANCHAMAYO", distrito: "PICHANAQUI" },
            { id: "120304", departamento: "JUNIN", provincia: "CHANCHAMAYO", distrito: "SAN RAMON" },
            { id: "150101", departamento: "LIMA", provincia: "LIMA", distrito: "LIMA" },
            { id: "150122", departamento: "LIMA", provincia: "LIMA", distrito: "MIRAFLORES" }
        ];
    }
    renderizarPaquetes();
    cargarDatosPaqueteActivo();
    cargarDepartamentos();
}

// -------------------------------------------------------------
// CRUD PAQUETES TARIFARIOS
// -------------------------------------------------------------
function renderizarPaquetes() {
    const cbo = document.getElementById('cboPaquetes');
    if (!cbo) return;
    cbo.innerHTML = paquetesBD.map(p => 
        `<option value="${p.id}" ${p.id === paqueteActivoId ? 'selected' : ''}>${p.nombre}</option>`
    ).join('');
}

function cambiarPaqueteActivo() {
    paqueteActivoId = document.getElementById('cboPaquetes').value;
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    zonaActivaId = (paq && paq.zonas.length > 0) ? paq.zonas[0].id : null;
    cargarDatosPaqueteActivo();
}

function cargarDatosPaqueteActivo() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (!paq) return;

    document.getElementById('txtNombrePaquete').value = paq.nombre;
    document.getElementById('cboTipoPaquete').value = paq.tipo;
    document.getElementById('lblClienteAsignado').textContent = `Cliente asignado: ${paq.cliente}`;
    
    document.getElementById('numSobreBase').value = paq.sobreBase;
    document.getElementById('numSobreExceso').value = paq.sobreExceso;
    document.getElementById('numCajaBase').value = paq.cajaBase;
    document.getElementById('numCajaExceso').value = paq.cajaExceso;

    renderizarZonas();
    refrescarListas();
}

function nuevoPaquete() {
    const nuevoId = 'PAQ-00' + (paquetesBD.length + 1);
    const nuevo = {
        id: nuevoId,
        nombre: 'Nuevo Paquete Tarifario',
        tipo: 'PERSONALIZADO',
        cliente: 'General (Todos)',
        sobreBase: 10.00,
        sobreExceso: 2.00,
        cajaBase: 13.00,
        cajaExceso: 5.00,
        zonas: [{ id: Date.now(), nombre: 'Zona Principal', sla: '24 a 48 Horas', distritosIds: [] }]
    };
    paquetesBD.push(nuevo);
    paqueteActivoId = nuevoId;
    zonaActivaId = nuevo.zonas[0].id;
    renderizarPaquetes();
    cargarDatosPaqueteActivo();
}

function actualizarNombrePaquete() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const nuevoNombre = document.getElementById('txtNombrePaquete').value.trim();
    if (paq && nuevoNombre) {
        paq.nombre = nuevoNombre;
        renderizarPaquetes();
    }
}

function actualizarTipoPaquete() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (paq) {
        paq.tipo = document.getElementById('cboTipoPaquete').value;
    }
}

function pedirConfirmacionEliminarPaquete() {
    if (paquetesBD.length <= 1) {
        alert("Debe existir al menos un paquete tarifario registrado.");
        return;
    }
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    document.getElementById('lblMensajeConfirmacion').textContent = `¿Estás seguro de eliminar permanentemente el paquete "${paq.nombre}"?`;
    accionPendienteConfirmacion = ejecutarEliminarPaquete;
    modalConfirmacionBS.show();
}

function ejecutarEliminarPaquete() {
    paquetesBD = paquetesBD.filter(p => p.id !== paqueteActivoId);
    paqueteActivoId = paquetesBD[0].id;
    zonaActivaId = paquetesBD[0].zonas.length > 0 ? paquetesBD[0].zonas[0].id : null;
    renderizarPaquetes();
    cargarDatosPaqueteActivo();
}

function guardarPreciosEnMemoria() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (paq) {
        paq.sobreBase = parseFloat(document.getElementById('numSobreBase').value) || 0;
        paq.sobreExceso = parseFloat(document.getElementById('numSobreExceso').value) || 0;
        paq.cajaBase = parseFloat(document.getElementById('numCajaBase').value) || 0;
        paq.cajaExceso = parseFloat(document.getElementById('numCajaExceso').value) || 0;
    }
}

// -------------------------------------------------------------
// BÚSQUEDA DE CLIENTE POR API (CONECTADO A C#)
// -------------------------------------------------------------
async function buscarClienteAPI(criterio) {
    const listaDiv = document.getElementById('listaResultadosCliente');
    if (!listaDiv) return;

    const textoBuscar = criterio.trim().toLowerCase();
    if (textoBuscar.length < 2) {
        listaDiv.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`${API_CLIENTES_URL}?buscar=${encodeURIComponent(textoBuscar)}`);
        if (!res.ok) throw new Error("Error al consultar API de clientes");
        
        const data = await res.json();

        if (data.length === 0) {
            listaDiv.innerHTML = '<div class="list-group-item text-muted small py-2">No se encontraron clientes</div>';
            return;
        }

        listaDiv.innerHTML = data.map(c => {
            const nombreMostrar = c.nombreRazonSocial || 'Cliente sin nombre';
            const docMostrar = c.numeroDocumento || 'Sin documento';
            const infoTexto = `${nombreMostrar} (${docMostrar})`;

            return `
                <button type="button" class="list-group-item list-group-item-action py-2 text-start" data-cliente="${infoTexto}">
                    <strong>${nombreMostrar}</strong> <br><small class="text-muted">Doc: ${docMostrar}</small>
                </button>
            `;
        }).join('');

        listaDiv.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => seleccionarCliente(btn.getAttribute('data-cliente'));
        });

    } catch (error) {
        console.error("Error al buscar cliente en la API:", error);
        listaDiv.innerHTML = '<div class="list-group-item text-danger small py-2">Error de conexión con la API</div>';
    }
}

function seleccionarCliente(infoCliente) {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (paq) {
        paq.cliente = infoCliente;
        document.getElementById('lblClienteAsignado').textContent = `Cliente actual: ${infoCliente}`;
        document.getElementById('txtBuscarCliente').value = '';
        document.getElementById('listaResultadosCliente').innerHTML = '';
    }
}

// -------------------------------------------------------------
// CRUD ZONAS Y SLA
// -------------------------------------------------------------
function renderizarZonas() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const cbo = document.getElementById('cboZonas');
    if (!cbo) return;

    if (!paq || paq.zonas.length === 0) {
        cbo.innerHTML = '<option value="">(Sin zonas asignadas)</option>';
        document.getElementById('txtNombreZona').value = '';
        document.getElementById('txtSlaZona').value = '';
        return;
    }

    cbo.innerHTML = paq.zonas.map(z => 
        `<option value="${z.id}" ${z.id === zonaActivaId ? 'selected' : ''}>${z.nombre} (${z.distritosIds.length} ciudades)</option>`
    ).join('');

    const zActual = paq.zonas.find(z => z.id === zonaActivaId);
    if (zActual) {
        document.getElementById('txtNombreZona').value = zActual.nombre;
        document.getElementById('txtSlaZona').value = zActual.sla || '24 Horas';
    }
}

function cambiarZonaActiva() {
    zonaActivaId = parseInt(document.getElementById('cboZonas').value);
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const zActual = paq?.zonas.find(z => z.id === zonaActivaId);
    if (zActual) {
        document.getElementById('txtNombreZona').value = zActual.nombre;
        document.getElementById('txtSlaZona').value = zActual.sla || '24 Horas';
    }
    refrescarListas();
}

function crearNuevaZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (!paq) return;

    const nueva = { id: Date.now(), nombre: 'Nueva Zona', sla: '24 Horas', distritosIds: [] };
    paq.zonas.push(nueva);
    zonaActivaId = nueva.id;
    renderizarZonas();
    refrescarListas();
}

function actualizarNombreZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const zActual = paq?.zonas.find(z => z.id === zonaActivaId);
    const nuevoNombre = document.getElementById('txtNombreZona').value.trim();
    if (zActual && nuevoNombre) {
        zActual.nombre = nuevoNombre;
        renderizarZonas();
    }
}

function actualizarSlaZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const zActual = paq?.zonas.find(z => z.id === zonaActivaId);
    if (zActual) {
        zActual.sla = document.getElementById('txtSlaZona').value.trim();
    }
}

function pedirConfirmacionEliminarZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (paq.zonas.length <= 1) {
        alert("Un paquete tarifario debe contar con al menos una zona.");
        return;
    }
    const zActual = paq.zonas.find(z => z.id === zonaActivaId);
    document.getElementById('lblMensajeConfirmacion').textContent = `¿Deseas eliminar la zona "${zActual.nombre}" y desasignar sus ciudades?`;
    accionPendienteConfirmacion = ejecutarEliminarZona;
    modalConfirmacionBS.show();
}

function ejecutarEliminarZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    paq.zonas = paq.zonas.filter(z => z.id !== zonaActivaId);
    zonaActivaId = paq.zonas[0].id;
    renderizarZonas();
    refrescarListas();
}

// -------------------------------------------------------------
// FILTROS DE CIUDADES Y DUAL BOX
// -------------------------------------------------------------
function cargarDepartamentos() {
    const deps = [...new Set(listaCiudadesAPI.map(c => c.departamento).filter(Boolean))].sort();
    const cbo = document.getElementById('cboDepartamento');
    if (!cbo) return;
    cbo.innerHTML = '<option value="">-- Todos los Departamentos --</option>' + 
        deps.map(d => `<option value="${d}">${d}</option>`).join('');
    cargarProvincias();
}

function cargarProvincias() {
    const dep = document.getElementById('cboDepartamento').value;
    const cbo = document.getElementById('cboProvincia');
    if (!cbo) return;

    if (!dep) {
        cbo.innerHTML = '<option value="">-- Todas las Provincias --</option>';
    } else {
        const provs = [...new Set(listaCiudadesAPI.filter(c => c.departamento === dep).map(c => c.provincia).filter(Boolean))].sort();
        cbo.innerHTML = '<option value="">-- Todas las Provincias --</option>' + 
            provs.map(p => `<option value="${p}">${p}</option>`).join('');
    }
    refrescarListas();
}

function refrescarListas() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (!paq) return;

    const zonaActual = paq.zonas.find(z => z.id === zonaActivaId);
    const idsZonaActual = zonaActual ? zonaActual.distritosIds : [];

    const ocupadasEnOtrasZonas = {};
    paq.zonas.forEach(z => {
        if (z.id !== zonaActivaId) {
            z.distritosIds.forEach(id => ocupadasEnOtrasZonas[id] = z.nombre);
        }
    });

    const depSel = document.getElementById('cboDepartamento')?.value || '';
    const provSel = document.getElementById('cboProvincia')?.value || '';
    const txtBuscar = document.getElementById('txtBuscar')?.value.toLowerCase().trim() || '';

    let ciudadesFiltradas = listaCiudadesAPI;

    if (txtBuscar) {
        ciudadesFiltradas = ciudadesFiltradas.filter(c => 
            c.distrito.toLowerCase().includes(txtBuscar) ||
            c.provincia.toLowerCase().includes(txtBuscar) ||
            c.departamento.toLowerCase().includes(txtBuscar)
        );
    } else {
        if (depSel) ciudadesFiltradas = ciudadesFiltradas.filter(c => c.departamento === depSel);
        if (provSel) ciudadesFiltradas = ciudadesFiltradas.filter(c => c.provincia === provSel);
    }

    // 1. COLUMNA DISPONIBLES
    const boxDisp = document.getElementById('boxDisponibles');
    if (boxDisp) {
        let htmlDisp = '';
        const listaDisp = ciudadesFiltradas.filter(c => !idsZonaActual.includes(c.id));

        if (listaDisp.length === 0) {
            htmlDisp = '<div class="p-4 text-center text-muted fw-bold">No hay ciudades para mostrar.</div>';
        } else {
            listaDisp.forEach(c => {
                const perteneceOtraZona = ocupadasEnOtrasZonas[c.id];

                if (perteneceOtraZona) {
                    htmlDisp += `
                        <div class="item-ciudad item-bloqueado">
                            <div>
                                <strong class="text-secondary">${c.distrito}</strong> 
                                <small class="text-muted d-block">${c.provincia}, ${c.departamento}</small>
                            </div>
                            <span class="badge bg-secondary px-2 py-1">Asignado a ${perteneceOtraZona}</span>
                        </div>
                    `;
                } else {
                    htmlDisp += `
                        <div class="item-ciudad">
                            <div>
                                <strong class="text-dark">${c.distrito}</strong> 
                                <small class="text-muted d-block">${c.provincia}, ${c.departamento}</small>
                            </div>
                            <button class="btn btn-sm btn-success fw-bold px-3 btn-accion btn-add-city" data-id="${c.id}">
                                <i class="fa-solid fa-plus me-1"></i> Añadir
                            </button>
                        </div>
                    `;
                }
            });
        }
        boxDisp.innerHTML = htmlDisp;

        boxDisp.querySelectorAll('.btn-add-city').forEach(btn => {
            btn.onclick = () => agregarCiudad(btn.getAttribute('data-id'));
        });
    }

    // 2. COLUMNA ASIGNADOS
    const boxAsig = document.getElementById('boxAsignados');
    if (boxAsig) {
        let htmlAsig = '';
        const listaAsig = listaCiudadesAPI.filter(c => idsZonaActual.includes(c.id));

        if (listaAsig.length === 0) {
            htmlAsig = '<div class="p-4 text-center text-muted fw-bold">Ninguna ciudad asignada a esta zona.</div>';
        } else {
            listaAsig.forEach(c => {
                htmlAsig += `
                    <div class="item-ciudad">
                        <div>
                            <strong class="text-success">${c.distrito}</strong> 
                            <small class="text-muted d-block">${c.provincia}, ${c.departamento}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger fw-bold btn-accion btn-del-city" data-id="${c.id}">
                            <i class="fa-solid fa-xmark me-1"></i> Quitar
                        </button>
                    </div>
                `;
            });
        }
        boxAsig.innerHTML = htmlAsig;

        boxAsig.querySelectorAll('.btn-del-city').forEach(btn => {
            btn.onclick = () => quitarCiudad(btn.getAttribute('data-id'));
        });
    }

    const lblTotal = document.getElementById('lblTotalAsignados');
    if (lblTotal) {
        lblTotal.textContent = `${idsZonaActual.length} Ciudades en Zona Activa`;
    }
    renderizarZonas();
}

function agregarCiudad(id) {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const z = paq?.zonas.find(item => item.id === zonaActivaId);
    if (z && !z.distritosIds.includes(id)) {
        z.distritosIds.push(id);
        refrescarListas();
    }
}

function quitarCiudad(id) {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const z = paq?.zonas.find(item => item.id === zonaActivaId);
    if (z) {
        z.distritosIds = z.distritosIds.filter(dId => dId !== id);
        refrescarListas();
    }
}

function agregarTodasLasVisibles() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const z = paq?.zonas.find(item => item.id === zonaActivaId);
    if (!z) return;

    const ocupadasEnOtras = new Set();
    paq.zonas.forEach(zona => {
        if (zona.id !== zonaActivaId) {
            zona.distritosIds.forEach(id => ocupadasEnOtras.add(id));
        }
    });

    const depSel = document.getElementById('cboDepartamento').value;
    const provSel = document.getElementById('cboProvincia').value;

    let candidatos = listaCiudadesAPI;
    if (depSel) candidatos = candidatos.filter(c => c.departamento === depSel);
    if (provSel) candidatos = candidatos.filter(c => c.provincia === provSel);

    candidatos.forEach(c => {
        if (!ocupadasEnOtras.has(c.id) && !z.distritosIds.includes(c.id)) {
            z.distritosIds.push(c.id);
        }
    });

    refrescarListas();
}

function pedirConfirmacionVaciarZona() {
    document.getElementById('lblMensajeConfirmacion').textContent = "¿Estás seguro de quitar todas las ciudades de esta zona?";
    accionPendienteConfirmacion = ejecutarVaciarZona;
    modalConfirmacionBS.show();
}

function ejecutarVaciarZona() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    const z = paq?.zonas.find(item => item.id === zonaActivaId);
    if (z) {
        z.distritosIds = [];
        refrescarListas();
    }
}

// GUARDADO GENERAL
async function guardarTodo() {
    guardarPreciosEnMemoria();

    try {
        const res = await fetch(`${API_BASE_URL}/tarifas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paquetesBD)
        });

        if (res.ok) {
            const data = await res.json();
            alert("¡Tarifas guardadas con éxito en la API!");
        } else {
            alert("Error al intentar guardar las tarifas en la API.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor.");
    }
}

// -------------------------------------------------------------
// VISTA PREVIA Y IMPRESIÓN
// -------------------------------------------------------------
function abrirVistaPreviaModal() {
    const paq = paquetesBD.find(p => p.id === paqueteActivoId);
    if (!paq) return;

    let htmlVista = `
        <div class="p-3 border rounded mb-4 bg-light">
            <h3 class="fw-bold text-primary mb-1">${paq.nombre}</h3>
            <p class="mb-1"><strong>Tipo:</strong> ${paq.tipo} | <strong>Cliente:</strong> ${paq.cliente}</p>
            <div class="row mt-3 border-top pt-2">
                <div class="col-6">
                    <strong>Sobres:</strong> Base S/ ${paq.sobreBase.toFixed(2)} | Exceso S/ ${paq.sobreExceso.toFixed(2)}/kg
                </div>
                <div class="col-6">
                    <strong>Cajas:</strong> Base S/ ${paq.cajaBase.toFixed(2)} | Exceso S/ ${paq.cajaExceso.toFixed(2)}/kg
                </div>
            </div>
        </div>

        <h5 class="fw-bold text-dark border-bottom pb-2">Estructura de Zonas y Cobertura:</h5>
    `;

    paq.zonas.forEach(z => {
        const ciudadesZona = listaCiudadesAPI.filter(c => z.distritosIds.includes(c.id));
        const nombresCiudades = ciudadesZona.map(c => `${c.distrito} (${c.provincia})`).join(', ');

        htmlVista += `
            <div class="mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold text-success mb-0">${z.nombre}</h6>
                    <span class="badge bg-secondary">Tiempo Entrega (SLA): ${z.sla || 'No especificado'}</span>
                </div>
                <p class="small text-dark mb-0">
                    <strong>Ciudades inclúidas (${ciudadesZona.length}):</strong> 
                    ${nombresCiudades.length > 0 ? nombresCiudades : '<em>Sin ciudades asignadas</em>'}
                </p>
            </div>
        `;
    });

    document.getElementById('seccionImprimible').innerHTML = htmlVista;
    modalVistaPreviaBS.show();
}

window.renderTarifas = renderTarifas;