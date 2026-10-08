using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ApiCourier.Migrations
{
    /// <inheritdoc />
    public partial class MigracionTarifasDefinitiva : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS \"PaquetesTarifarios\" CASCADE;");
            migrationBuilder.CreateTable(
                name: "PaquetesTarifarios",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Codigo = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    EsRegular = table.Column<bool>(type: "boolean", nullable: false),
                    ClientesIds = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaquetesTarifarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ZonaTarifaria",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PaqueteTarifarioId = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Sla = table.Column<string>(type: "text", nullable: false),
                    DistritosIds = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ZonaTarifaria", x => new { x.PaqueteTarifarioId, x.Id });
                    table.ForeignKey(
                        name: "FK_ZonaTarifaria_PaquetesTarifarios_PaqueteTarifarioId",
                        column: x => x.PaqueteTarifarioId,
                        principalTable: "PaquetesTarifarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServicioTarifario",
                columns: table => new
                {
                    ZonaTarifariaPaqueteTarifarioId = table.Column<string>(type: "text", nullable: false),
                    ZonaTarifariaId = table.Column<string>(type: "text", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    PrecioBase = table.Column<decimal>(type: "numeric", nullable: false),
                    PrecioExceso = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicioTarifario", x => new { x.ZonaTarifariaPaqueteTarifarioId, x.ZonaTarifariaId, x.Id });
                    table.ForeignKey(
                        name: "FK_ServicioTarifario_ZonaTarifaria_ZonaTarifariaPaqueteTarifar~",
                        columns: x => new { x.ZonaTarifariaPaqueteTarifarioId, x.ZonaTarifariaId },
                        principalTable: "ZonaTarifaria",
                        principalColumns: new[] { "PaqueteTarifarioId", "Id" },
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServicioTarifario");

            migrationBuilder.DropTable(
                name: "ZonaTarifaria");

            migrationBuilder.DropTable(
                name: "PaquetesTarifarios");
        }
    }
}
