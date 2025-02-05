using Microsoft.Extensions.DependencyInjection;
using SV.Pay.Data.Context;

namespace SV.Pay.IntegrationTests.Abstractions;

public class BaseIntegrationTest : IClassFixture<IntegrationTestWebAppFactory>
{
    protected HttpClient HttpClient { get; init; }
    protected PaymentsDbContext DbContext { get; init; }

    public BaseIntegrationTest(IntegrationTestWebAppFactory factory)
    {

        HttpClient = factory.CreateClient();
        IServiceScope scope = factory.Services.CreateScope();
        DbContext = scope.ServiceProvider.GetRequiredService<PaymentsDbContext>();
    }
}
