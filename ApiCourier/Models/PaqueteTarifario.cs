namespace ApiCourier.Models
{
    public class PaqueteTarifario
    {
        public string Id { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public bool EsRegular { get; set; }
        public List<string> ClientesIds { get; set; } = new();
        public List<ZonaTarifaria> Zonas { get; set; } = new();
    }

    public class ZonaTarifaria
    {
        public string Id { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Sla { get; set; } = string.Empty;
        public List<string> DistritosIds { get; set; } = new();
        public List<ServicioTarifario> Servicios { get; set; } = new();
    }

    public class ServicioTarifario
    {
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioBase { get; set; }
        public decimal PrecioExceso { get; set; }
    }
}