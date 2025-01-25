using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SV.Pay.Api;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Data.Context;
using Testcontainers.MsSql;

namespace SV.Pay.IntegrationTests.Abstractions;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly MsSqlContainer _databaseContainer = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/azure-sql-edge")
        .WithPassword("PleaseDontUseThisP@ssw0rd")
        .WithEnvironment("ACCEPT_EULA", "Y")
        .Build();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<PaymentsDbContext>));

            services.AddDbContext<PaymentsDbContext>(options =>
            {
                options.UseSqlServer(_databaseContainer.GetConnectionString(), mssqlOptions =>
                    mssqlOptions.MigrationsHistoryTable(HistoryRepository.DefaultTableName))
                    .UseSnakeCaseNamingConvention();
            });
        });
    }

    public Task InitializeAsync() => _databaseContainer.StartAsync();

    public Task DisposeAsync() => _databaseContainer.StopAsync();
}
