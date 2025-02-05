using System.Reflection;
using Serilog;
using SV.Pay.Api;
using SV.Pay.Api.Extensions;
using SV.Pay.Application;
using SV.Pay.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.AddEnvironmentConfiguration(args);

builder.Host.UseSerilog((context, loggerConfig) => loggerConfig.ReadFrom.Configuration(context.Configuration));

builder.Services
    .AddApplication()
    .AddPresentation()
    .AddInfrastructure(builder.Configuration);

builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

WebApplication app = builder.Build();

app.UseCors();
app.UseRouting();

var group = app.MapGroup("api/v1");
app.MapEndpoints(group);

if (app.Environment.IsDevelopment())
{
    app.ApplyMigrations();
}

app.UseSwaggerOpenApi();

app.UseSerilogRequestLogging();

app.UseExceptionHandler();

await app.RunAsync();

// Required for integration tests
namespace SV.Pay.Api
{
    public partial class Program;
}
