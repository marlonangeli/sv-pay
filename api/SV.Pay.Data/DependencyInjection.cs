using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Data.Context;

namespace SV.Pay.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) =>
        services.AddDatabase(configuration);

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("Payments");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            string? host = (configuration["DOTNET_RUNNING_IN_CONTAINER"] == "true"
                ? configuration["SQLSERVER_HOST"]
                : "localhost");
            string? port = configuration["SQLSERVER_PORT"];
            string? database = configuration["SQLSERVER_DATABASE"];
            string? user = configuration["SQLSERVER_USER"];
            string? password = configuration["SQLSERVER_PASSWORD"];
            string? options = configuration["SQLSERVER_OPTIONS"];

            connectionString = CreateConnectionString(host, port, database, user, password, options);
        }

        services.AddDbContext<PaymentsDbContext>(
            options =>
            {
                options
                    .UseSqlServer(connectionString, msSqlOptions =>
                        msSqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName))
                    .UseSnakeCaseNamingConvention();
            });

        services.AddScoped<IPaymentsDbContext>(sp => sp.GetRequiredService<PaymentsDbContext>());

        return services;
    }

    private static string CreateConnectionString(string? host, string? port, string? database, string user,
        string password, string? options = null) =>
        $"Server={host},{port};Database={database};User Id={user};Password={password};{options}";
}
