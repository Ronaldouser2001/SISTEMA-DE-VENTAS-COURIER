const API_TARIFAS_URL = 'http://localhost:5211/api/tarifas';
const API_CLIENTES_URL = 'http://localhost:5211/api/clientes';
const API_CIUDADES_URL = 'http://localhost:5211/api/ciudades';

let paquetesBD = [];

// Función para cargar tarifas desde el backend C#
async function cargarTarifasEnVentas() {
    try {
        const res = await fetch(API_TARIFAS_URL);
        if (!res.ok) throw new Error("Error al obtener las tarifas desde la API");

        paquetesBD = await res.json();
        console.log("Tarifas cargadas con éxito en Ventas:", paquetesBD);
    } catch (error) {
        console.error("No se pudieron cargar las tarifas en Ventas:", error);
    }
}

async function renderVentas() {
    const contenedor = document.getElementById('dynamic-content');
    if (!contenedor) return;

    await cargarTarifasEnVentas();

    contenedor.innerHTML = `
        <div class="container-fluid p-0">
            <!-- ENCABEZADO DE LA SECCIÓN -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="fw-bold m-0"><i class="fa-solid fa-cart-shopping text-warning me-2"></i>Módulo de Ventas</h4>
                    <small class="text-muted">Registro de nuevos envíos y cotización de servicios courier</small>
                </div>
            </div>

            <div class="row g-4">
                <!-- COLUMNA IZQUIERDA: FORMULARIO DE REGISTRO -->
                <div class="col-lg-8">
                    
                    <!-- BLOQUE 1: DATOS DEL CLIENTE / REMITENTE -->
                    <div class="card border-0 shadow-sm mb-4">
                        <div class="card-header bg-white py-3">
                            <h6 class="fw-bold m-0 text-dark"><i class="fa-solid fa-user me-2 text-primary"></i>1. Datos del Remitente</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Tipo Documento</label>
                                    <select class="form-select form-select-sm" id="ventasTipoDoc">
                                        <option value="DNI">DNI</option>
                                        <option value="RUC">RUC</option>
                                    </select>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label small fw-bold">N° Documento</label>
                                    <div class="input-group input-group-sm">
                                        <input type="text" class="form-control" id="ventasNumDoc" placeholder="Buscar documento...">
                                        <button class="btn btn-outline-secondary" type="button" id="btnBuscarCliente">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold">Teléfono</label>
                                    <input type="text" class="form-control form-control-sm" id="ventasTelefono">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label small fw-bold">Nombres / Razón Social</label>
                                    <input type="text" class="form-control form-control-sm" id="ventasNombreCliente">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BLOQUE 2: DATOS DEL ENVÍO Y DESTINO -->
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white py-3">
                            <h6 class="fw-bold m-0 text-dark"><i class="fa-solid fa-box me-2 text-primary"></i>2. Detalles del Envío</h6>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Ciudad Origen</label>
                                    <select class="form-select form-select-sm" id="ventasOrigen">
                                        <option value="">Cargando ciudades...</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold">Ciudad Destino</label>
                                    <select class="form-select form-select-sm" id="ventasDestino">
                                        <option value="">Cargando ciudades...</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Peso (Kg)</label>
                                    <input type="number" class="form-control form-control-sm" id="ventasPeso" min="0.1" step="0.1" value="1.0">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label small fw-bold">Tipo de Carga</label>
                                    <select class="form-select form-select-sm" id="ventasTipoCarga">
                                        <option value="SOBRE">Sobre / Documento</option>
                                        <option value="PAQUETE">Paquete / Caja</option>
                                    </select>
                                </div>
                                <div class="col-md-4 d-flex align-items-end">
                                    <button class="btn btn-warning btn-sm w-100 fw-bold" id="btnCalcularVenta">
                                        <i class="fa-solid fa-calculator me-1"></i>Calcular Tarifa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- COLUMNA DERECHA: RESUMEN Y LIQUIDACIÓN -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm bg-white">
                        <div class="card-header bg-dark text-white py-3">
                            <h6 class="fw-bold m-0"><i class="fa-solid fa-receipt me-2"></i>Resumen de Cobro</h6>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted small">Tarifa Base:</span>
                                <span class="fw-bold small" id="resumenBase">S/ 0.00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted small">Adicional por Peso:</span>
                                <span class="fw-bold small" id="resumenAdicional">S/ 0.00</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="fw-bold">TOTAL A PAGAR:</span>
                                <span class="fs-4 fw-bold text-success" id="resumenTotal">S/ 0.00</span>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold">Tipo Comprobante</label>
                                <select class="form-select form-select-sm" id="ventasComprobante">
                                    <option value="BOLETA">Boleta de Venta</option>
                                    <option value="FACTURA">Factura</option>
                                </select>
                            </div>

                            <button class="btn btn-success w-100 py-2 fw-bold" id="btnProcesarVenta">
                                <i class="fa-solid fa-check-circle me-1"></i>Procesar Venta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Cargar datos iniciales
    cargarCiudadesVentas();

    // Inicializar eventos de los botones
    inicializarEventosVentas();
}

function cargarCiudadesVentas() {
    const origenSelect = document.getElementById('ventasOrigen');
    const destinoSelect = document.getElementById('ventasDestino');

    fetch(API_CIUDADES_URL)
        .then(res => res.json())
        .then(data => {
            let html = '<option value="">Seleccione una ubicación</option>';
            data.forEach(c => {
                // Se valida la estructura del modelo C# (distrito, departamento)
                const nombreMostrar = c.distrito ? `${c.distrito} (${c.departamento})` : (c.nombre || `Ciudad ${c.id}`);
                const valor = c.id || c.distrito || c.nombre;
                html += `<option value="${valor}">${nombreMostrar}</option>`;
            });
            if (origenSelect) origenSelect.innerHTML = html;
            if (destinoSelect) destinoSelect.innerHTML = html;
        })
        .catch(() => {
            // Datos demo de respaldo si la API no responde
            const demo = '<option value="1">Lima (Lima)</option><option value="2">Arequipa (Arequipa)</option><option value="3">Huancayo (Junín)</option>';
            if (origenSelect) origenSelect.innerHTML = demo;
            if (destinoSelect) destinoSelect.innerHTML = demo;
        });
}

function inicializarEventosVentas() {
    // 1. Botón Buscar Cliente
    const btnBuscar = document.getElementById('btnBuscarCliente');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', async () => {
            const numDoc = document.getElementById('ventasNumDoc').value.trim();
            if (!numDoc) {
                alert('Por favor ingrese un número de documento.');
                return;
            }

            try {
                const res = await fetch(`${API_CLIENTES_URL}?buscar=${encodeURIComponent(numDoc)}`);
                if (res.ok) {
                    const clientes = await res.json();
                    const cliente = clientes.find(c => c.numeroDocumento === numDoc) || clientes[0];
                    if (cliente) {
                        document.getElementById('ventasNombreCliente').value = cliente.nombreRazonSocial || '';
                        document.getElementById('ventasTelefono').value = cliente.telefono || '';
                    } else {
                        alert('Cliente no encontrado en el sistema.');
                    }
                } else {
                    alert('Cliente no encontrado en el sistema.');
                }
            } catch (error) {
                console.error("Error al buscar cliente:", error);
                alert('No se pudo conectar con la API de clientes.');
            }
        });
    }

    // 2. Botón Calcular Tarifa
    const btnCalcular = document.getElementById('btnCalcularVenta');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', () => {
            const origen = document.getElementById('ventasOrigen').value;
            const destino = document.getElementById('ventasDestino').value;
            const peso = parseFloat(document.getElementById('ventasPeso').value) || 0;
            const tipoCarga = document.getElementById('ventasTipoCarga').value;

            if (!origen || !destino) {
                alert('Por favor seleccione una ciudad de origen y destino.');
                return;
            }

            // Obtener paquete activo (Por defecto el primero o regular)
            const paqueteActual = paquetesBD[0] || {
                sobreBase: 10.00,
                sobreExceso: 2.00,
                cajaBase: 13.00,
                cajaExceso: 5.00
            };

            let tarifaBase = tipoCarga === 'SOBRE' ? paqueteActual.sobreBase : paqueteActual.cajaBase;
            let costoExceso = tipoCarga === 'SOBRE' ? paqueteActual.sobreExceso : paqueteActual.cajaExceso;

            // Cálculo de peso base hasta 1.5 kg
            let adicionalPeso = peso > 1.5 ? Math.ceil(peso - 1.5) * costoExceso : 0;
            let total = tarifaBase + adicionalPeso;

            document.getElementById('resumenBase').textContent = `S/ ${tarifaBase.toFixed(2)}`;
            document.getElementById('resumenAdicional').textContent = `S/ ${adicionalPeso.toFixed(2)}`;
            document.getElementById('resumenTotal').textContent = `S/ ${total.toFixed(2)}`;
        });
    }

    // 3. Botón Procesar Venta
    const btnProcesar = document.getElementById('btnProcesarVenta');
    if (btnProcesar) {
        btnProcesar.addEventListener('click', () => {
            const totalTexto = document.getElementById('resumenTotal').textContent;
            const cliente = document.getElementById('ventasNombreCliente').value.trim();

            if (totalTexto === 'S/ 0.00') {
                alert('Debe calcular la tarifa antes de procesar la venta.');
                return;
            }

            if (!cliente) {
                alert('Por favor ingrese o busque los datos del cliente.');
                return;
            }

            alert(`¡Venta procesada con éxito!\nCliente: ${cliente}\nTotal: ${totalTexto}`);
        });
    }
}

window.renderVentas = renderVentas;