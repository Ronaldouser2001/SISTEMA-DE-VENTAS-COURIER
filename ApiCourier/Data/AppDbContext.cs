using Microsoft.EntityFrameworkCore;
using ApiCourier.Models;

namespace ApiCourier.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<PaqueteTarifario> PaquetesTarifarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Índice único para clientes
            modelBuilder.Entity<Cliente>()
                .HasIndex(c => c.NumeroDocumento)
                .IsUnique();

            // Configuración de entidades embebidas/propiedad para Tarifas
            modelBuilder.Entity<PaqueteTarifario>(b =>
            {
                b.OwnsMany(p => p.Zonas, z =>
                {
                    z.OwnsMany(z1 => z1.Servicios);
                });
            });
        }
    }
}