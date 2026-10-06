using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace ApiCourier.Controllers
{
    public class ClienteDto
    {
        public string TipoDocumento { get; set; } = "DNI";
        public string NumeroDocumento { get; set; } = string.Empty;
        public string NombreRazonSocial { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string? NombrePaqueteTarifario { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private static List<ClienteDto> _clientes = new()
        {
            new ClienteDto 
            { 
                TipoDocumento = "RUC", 
                NumeroDocumento = "20100047218", 
                NombreRazonSocial = "BANCO DE CREDITO DEL PERU", 
                Telefono = "011234567", 
                Correo = "contacto@bcp.com.pe", 
                Direccion = "Av. Centenario 156", 
                NombrePaqueteTarifario = "Tarifa Corporativa BCP" 
            }
        };

        [HttpGet]
        public IActionResult Get([FromQuery] string? buscar)
        {
            if (string.IsNullOrWhiteSpace(buscar))
                return Ok(_clientes);

            var query = buscar.Trim().ToLower();
            var resultado = _clientes.Where(c =>
                c.NumeroDocumento.ToLower().Contains(query) ||
                c.NombreRazonSocial.ToLower().Contains(query)
            ).ToList();

            return Ok(resultado);
        }

        [HttpPost]
        public IActionResult Post([FromBody] ClienteDto cliente)
        {
            if (cliente == null || string.IsNullOrWhiteSpace(cliente.NumeroDocumento))
                return BadRequest("Datos de cliente inválidos.");

            var existente = _clientes.FirstOrDefault(c => c.NumeroDocumento == cliente.NumeroDocumento);
            if (existente != null)
            {
                _clientes.Remove(existente);
            }

            _clientes.Add(cliente);
            return Ok(new { mensaje = "Cliente guardado exitosamente" });
        }
    }
}