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
        string? connectionString = configuration.GetConnectionString("Payments") ??
                                   configuration["SQLSERVER_CONNECTION_STRING"];

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
}
