using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace ApiCourier.Controllers
{
    public class CiudadDto
    {
        public string Id { get; set; } = string.Empty;
        public string Departamento { get; set; } = string.Empty;
        public string Provincia { get; set; } = string.Empty;
        public string Distrito { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CiudadesController : ControllerBase
    {
        private static readonly List<CiudadDto> _ciudades = new()
        {
            new CiudadDto { Id = "120101", Departamento = "JUNIN", Provincia = "HUANCAYO", Distrito = "HUANCAYO" },
            new CiudadDto { Id = "120107", Departamento = "JUNIN", Provincia = "HUANCAYO", Distrito = "CHILCA" },
            new CiudadDto { Id = "120114", Departamento = "JUNIN", Provincia = "HUANCAYO", Distrito = "EL TAMBO" },
            new CiudadDto { Id = "120301", Departamento = "JUNIN", Provincia = "CHANCHAMAYO", Distrito = "CHANCHAMAYO" },
            new CiudadDto { Id = "120302", Departamento = "JUNIN", Provincia = "CHANCHAMAYO", Distrito = "PERENE" },
            new CiudadDto { Id = "120303", Departamento = "JUNIN", Provincia = "CHANCHAMAYO", Distrito = "PICHANAQUI" },
            new CiudadDto { Id = "120304", Departamento = "JUNIN", Provincia = "CHANCHAMAYO", Distrito = "SAN RAMON" },
            new CiudadDto { Id = "150101", Departamento = "LIMA", Provincia = "LIMA", Distrito = "LIMA" },
            new CiudadDto { Id = "150122", Departamento = "LIMA", Provincia = "LIMA", Distrito = "MIRAFLORES" }
        };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_ciudades);
        }
    }
}