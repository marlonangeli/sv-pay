using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using SV.Pay.IntegrationTests.Contracts;

namespace SV.Pay.IntegrationTests.Extensions;

internal static class HttpResponseMessageExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        Converters = { new JsonStringEnumConverter() },
        PropertyNameCaseInsensitive = true
    };

    internal static async Task<T> GetContent<T>(
        this HttpResponseMessage response)
    {
        string content = await response.Content.ReadAsStringAsync();
        T? deserializedContent = JsonSerializer.Deserialize<T>(content, JsonOptions);

        if (deserializedContent is null)
            throw new InvalidOperationException("Content not found");

        return deserializedContent;
    }

    internal static async Task<CustomProblemDetails> GetCustomProblemDetails(
        this HttpResponseMessage response)
    {
        CustomProblemDetails content = await response.GetContent<CustomProblemDetails>();

        return content;
    }

    internal static async Task<ProblemDetails> GetProblemDetails(
        this HttpResponseMessage response)
    {
        ProblemDetails content = await response.GetContent<ProblemDetails>();

        return content;
    }
}
