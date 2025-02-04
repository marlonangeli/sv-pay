using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SV.Pay.Api.Extensions;

public static class SwaggerExtensions
{
    public static void AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "SV.Pay.Api", Version = "v1" });
            options.SchemaFilter<EnumSchemaFilter>();
        });
    }

    public static void UseSwaggerOpenApi(this WebApplication app)
    {
        app.UseSwagger();

        app.UseSwaggerUI(options =>
        {
            options.DisplayOperationId();
            options.DisplayRequestDuration();
            options.EnableTryItOutByDefault();
            options.EnableDeepLinking();
            options.EnableFilter();
            options.ShowExtensions();
            options.ShowCommonExtensions();
            options.EnableValidator();
        });
    }

    public static RouteHandlerBuilder ProducesBadRequest(this RouteHandlerBuilder builder) =>
        builder
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest);

    public static RouteHandlerBuilder ProducesNotFound(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status404NotFound);

    public static RouteHandlerBuilder ProducesConflict(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status409Conflict);

    public static RouteHandlerBuilder ProducesInternalServerError(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status500InternalServerError);

    /// <summary>
    /// Extension method that produces BadRequest, NotFound, Conflict and InternalServerError
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    public static RouteHandlerBuilder ProducesErrors(this RouteHandlerBuilder builder) =>
        builder
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
}

public class EnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (!context.Type.IsEnum)
            return;

        schema.Enum.Clear();

        foreach (var value in Enum.GetValues(context.Type))
        {
            schema.Enum.Add(new OpenApiString(value.ToString()));
        }
    }
}
