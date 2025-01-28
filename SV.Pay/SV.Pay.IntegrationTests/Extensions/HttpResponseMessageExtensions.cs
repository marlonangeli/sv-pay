using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using SV.Pay.IntegrationTests.Contracts;

namespace SV.Pay.IntegrationTests.Extensions;

internal static class HttpResponseMessageExtensions
{
    private static async Task<T> GetContent<T>(
        this HttpResponseMessage response)
    {
        T? content = await response.Content.ReadFromJsonAsync<T>();

        if (content is null)
            throw new InvalidOperationException("Content not found");

        return content;
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
