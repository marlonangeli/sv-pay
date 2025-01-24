using DotNetEnv;

namespace SV.Pay.Api.Extensions;

internal static class EnvironmentConfigurationExtensions
{
    public static void AddEnvironmentConfiguration(this WebApplicationBuilder builder, string[] args)
    {
        if (!builder.Environment.IsProduction())
            Env.Load(Path.Combine("..", "..", ".env")); // Load .env file from root directory in repository

        builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .AddCommandLine(args)
            .Build();
    }
}
