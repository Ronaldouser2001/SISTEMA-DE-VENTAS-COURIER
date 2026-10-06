namespace ApiCourier.Models
{
    public class ZonaTarifaria
    {
        public long Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Sla { get; set; } = "24 Horas";
        public List<string> DistritosIds { get; set; } = new();
    }
}