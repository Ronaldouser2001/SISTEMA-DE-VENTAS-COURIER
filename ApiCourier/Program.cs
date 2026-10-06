var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRAR LOS CONTROLADORES
builder.Services.AddControllers(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();

// 2. MAPEAR LOS CONTROLADORES (ESTO ES OBLIGATORIO)
app.MapControllers(); 

app.Run();