namespace SV.Pay.IntegrationTests.Abstractions;

public class BaseIntegrationTest : IClassFixture<IntegrationTestWebAppFactory>
{
    protected HttpClient HttpClient { get; init; }

    public BaseIntegrationTest(IntegrationTestWebAppFactory factory)
    {
        HttpClient = factory.CreateClient();
    }
}
