using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using SV.Pay.Api.Extensions;
using SV.Pay.Api.Middlewares;

namespace SV.Pay.Api;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwagger();

        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        services.AddCors(cors => cors.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowAnyOrigin();
            policy.WithExposedHeaders("Location");
            policy.SetPreflightMaxAge(TimeSpan.FromDays(1));
        }));

        return services;
    }
}
