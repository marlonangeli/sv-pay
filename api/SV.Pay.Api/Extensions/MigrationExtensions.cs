using Microsoft.EntityFrameworkCore;
using SV.Pay.Data.Context;

namespace SV.Pay.Api.Extensions;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using IServiceScope scope = app.ApplicationServices.CreateScope();

        using PaymentsDbContext dbContext =
            scope.ServiceProvider.GetRequiredService<PaymentsDbContext>();

        dbContext.Database.Migrate();
    }
}
