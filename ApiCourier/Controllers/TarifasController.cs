using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using ApiCourier.Models;

namespace ApiCourier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarifasController : ControllerBase
    {
        // Simulación de almacenamiento en memoria
        private static List<PaqueteTarifario> _paquetes = new()
        {
            new PaqueteTarifario
            {
                Id = "PAQ-001",
                Nombre = "Tarifa Regular General",
                Tipo = "REGULAR",
                Cliente = "General (Todos)",
                SobreBase = 10.00m,
                SobreExceso = 2.00m,
                CajaBase = 13.00m,
                CajaExceso = 5.00m,
                Zonas = new List<ZonaTarifaria>
                {
                    new ZonaTarifaria { Id = 1, Nombre = "Zona Local Huancayo", Sla = "24 Horas", DistritosIds = new() { "120101", "120107", "120114" } },
                    new ZonaTarifaria { Id = 2, Nombre = "Zona Selva Chanchamayo", Sla = "48 Horas", DistritosIds = new() { "120301", "120302" } }
                }
            }
        };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_paquetes);
        }

        [HttpPost]
        public IActionResult Post([FromBody] PaqueteTarifario paquete)
        {
            if (paquete == null)
                return BadRequest("Datos de paquete inválidos.");

            _paquetes.Add(paquete);
            return Ok(new { mensaje = "Tarifa guardada exitosamente" });
        }
    }
}