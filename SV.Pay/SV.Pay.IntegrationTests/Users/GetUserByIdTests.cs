using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using SV.Pay.Application.Core.Users.Create;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;

namespace SV.Pay.IntegrationTests.Users;

public class GetUserByIdTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly CreateUserCommand _baseRequest = new(
        FirstName: "Steve",
        LastName: "Jobs",
        Email: "steve.jobs@apple.com",
        DateOfBirth: DateTime.Parse("1955-02-24"),
        CPF: "714.723.570-35"
    );

    [Fact]
    public async Task Should_ReturnNotFound_When_UserNotFound()
    {
        // Arrange
        Guid userId = Guid.NewGuid();

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Should_ReturnOk_When_UserFound()
    {
        // Arrange
        object request = _baseRequest with
        {
            Email = "steve.jobs2@apple.com",
            CPF = "123.456.789-09"
        };
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);
        var userId = await response.Content.ReadFromJsonAsync<Guid>();

        // Act
        var response2 = await HttpClient.GetAsync($"/api/v1/users/{userId}");

        // Assert
        response2.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Should_ReturnUser_When_UserFound()
    {
        // Arrange
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", _baseRequest);
        var userId = await response.Content.ReadFromJsonAsync<Guid>();

        // Act
        var response2 = await HttpClient.GetAsync($"/api/v1/users/{userId}");
        var user = await response2.Content.ReadFromJsonAsync<User>();

        // Assert
        user.Should().NotBeNull();
        user.FirstName.Should().Be(_baseRequest.FirstName);
        user.LastName.Should().Be(_baseRequest.LastName);
        user.Email.Should().Be(_baseRequest.Email);
        user.BirthDate.Should().Be(DateOnly.FromDateTime(_baseRequest.DateOfBirth));
        user.CPF.Should().Be(new CPF(_baseRequest.CPF));
    }

    [Fact]
    public async Task Should_ReturnInternalServerError_When_UserIdIsInvalid()
    {
        // Arrange
        string invalidUserId = "invalid-user-id";

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/users/{invalidUserId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }
}
