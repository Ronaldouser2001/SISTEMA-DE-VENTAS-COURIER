namespace ApiCourier.Models
{
    public class PaqueteTarifario
    {
        public string Id { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = "REGULAR";
        public string Cliente { get; set; } = "General (Todos)";
        public decimal SobreBase { get; set; }
        public decimal SobreExceso { get; set; }
        public decimal CajaBase { get; set; }
        public decimal CajaExceso { get; set; }
        public List<ZonaTarifaria> Zonas { get; set; } = new();
    }
}