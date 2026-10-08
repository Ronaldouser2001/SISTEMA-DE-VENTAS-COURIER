using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiCourier.Data;
using ApiCourier.Models;

namespace ApiCourier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/clientes?buscar=123
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string? buscar)
        {
            var query = _context.Clientes.Where(c => c.Estado);

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                var filtro = buscar.Trim().ToLower();
                query = query.Where(c =>
                    c.NumeroDocumento.ToLower().Contains(filtro) ||
                    c.NombreRazonSocial.ToLower().Contains(filtro)
                );
            }

            var resultado = await query.ToListAsync();
            return Ok(resultado);
        }

        // POST: api/clientes (Crear o Actualizar)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cliente dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.NumeroDocumento))
                return BadRequest("Datos de cliente inválidos.");

            var existente = await _context.Clientes
                .FirstOrDefaultAsync(c => c.NumeroDocumento == dto.NumeroDocumento);

            if (existente != null)
            {
                // Actualizar cliente existente
                existente.TipoDocumento = dto.TipoDocumento;
                existente.NombreRazonSocial = dto.NombreRazonSocial;
                existente.Telefono = dto.Telefono;
                existente.Correo = dto.Correo;
                existente.Direccion = dto.Direccion;
                existente.NombrePaqueteTarifario = dto.NombrePaqueteTarifario;
                existente.Estado = true;
            }
            else
            {
                // Crear nuevo cliente
                _context.Clientes.Add(dto);
            }

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Cliente guardado exitosamente en PostgreSQL" });
        }
    }
}