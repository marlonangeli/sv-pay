namespace SV.Pay.Api.Endpoints.Test;

internal sealed class Get : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("test", () => Task.FromResult(Results.Ok("Ok")))
        .WithTags("Test")
        .WithDescription("Test endpoint");
    }
}
