using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ApiCourier.Data;
using ApiCourier.Models;

namespace ApiCourier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarifasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TarifasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/tarifas
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Sin .Include() porque OwnsMany lo carga automáticamente
            var paquetes = await _context.PaquetesTarifarios.ToListAsync();
            return Ok(paquetes);
        }

        // POST: api/tarifas
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PaqueteTarifario paquete)
        {
            if (paquete == null) return BadRequest("Datos nulos.");

            var existente = await _context.PaquetesTarifarios
                .FirstOrDefaultAsync(p => p.Id == paquete.Id);

            if (existente != null)
            {
                _context.PaquetesTarifarios.Remove(existente);
                await _context.SaveChangesAsync();
            }

            _context.PaquetesTarifarios.Add(paquete);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Guardado exitosamente en PostgreSQL", id = paquete.Id });
        }
    }
}