using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using SV.Pay.Api.Endpoints.Users;
using SV.Pay.Application.Core.Users.Create;
using SV.Pay.Domain;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Users;

public class SearchUserTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly CreateUserCommand _baseRequest = new(
        FirstName: "Bill",
        LastName: "Gates",
        Email: "bill.gates@microsoft.com",
        DateOfBirth: DateTime.Parse("1955-10-28"),
        CPF: "447.658.370-92"
    );

    [Fact]
    public async Task SearchByEmail_Should_ReturnNotFound_When_UserNotFound()
    {
        // Arrange
        string email = "notfound@email.com";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.Email, email));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task SearchByCPF_Should_ReturnNotFound_When_UserNotFound()
    {
        // Arrange
        string cpf = "123.456.789-09";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.CPF, cpf));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task SearchByEmail_Should_ReturnOk_When_UserFound()
    {
        // Arrange
        string email = "valid@microsoft.com";
        object request = _baseRequest with
        {
            Email = email,
            CPF = "696.824.360-10"
        };
        await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.Email, email));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var user = await response.Content.ReadFromJsonAsync<User>();
        user.Should().NotBeNull();
        user.Email.Should().Be(email);
    }

    [Fact]
    public async Task SearchByCPF_Should_ReturnOk_When_UserFound()
    {
        // Arrange
        string cpf = "027.938.580-30";
        object request = _baseRequest with
        {
            Email = "valid-cpf@microsoft.com",
            CPF = cpf
        };
        await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.CPF, cpf));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var user = await response.Content.ReadFromJsonAsync<User>();
        user.Should().NotBeNull();
        user.CPF.Should().Be(new CPF(cpf));
    }

    [Fact]
    public async Task SearchByEmail_Should_ReturnBadRequest_When_EmailIsEmpty()
    {
        // Arrange
        string email = string.Empty;

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.Email, email));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidEmail.Code &&
                e.Description == UserErrors.InvalidEmail.Description);
    }

    [Fact]
    public async Task SearchByCPF_Should_ReturnBadRequest_When_CPFIsEmpty()
    {
        // Arrange
        string cpf = string.Empty;

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.CPF, cpf));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidCPF.Code &&
                e.Description == UserErrors.InvalidCPF.Description);
    }

    [Fact]
    public async Task SearchByEmail_Should_ReturnBadRequest_When_EmailIsInvalid()
    {
        // Arrange
        string email = "invalidemail";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.Email, email));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidEmail.Code &&
                e.Description == UserErrors.InvalidEmail.Description);
    }

    [Fact]
    public async Task SearchByCPF_Should_ReturnBadRequest_When_CPFIsInvalid()
    {
        // Arrange
        string cpf = "123.456.789-10";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest(GetUserRequestType.CPF, cpf));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidCPF.Code &&
                e.Description == UserErrors.InvalidCPF.Description);
    }

    [Fact]
    public async Task SearchByEmail_Should_ReturnInternalServerError_When_RequestTypeIsInvalid()
    {
        // Arrange
        string email = "invalidemail";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest((GetUserRequestType)3, email));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(GlobalSharedErrors.InvalidRequestType.Code);
        errorResponse.Detail.Should().Be(GlobalSharedErrors.InvalidRequestType.Description);
    }

    [Fact]
    public async Task SearchByCPF_Should_ReturnInternalServerError_When_RequestTypeIsInvalid()
    {
        // Arrange
        string cpf = "123.456.789-10";

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users/search",
            new GetUserByEmailOrCPFRequest((GetUserRequestType)3, cpf));

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(GlobalSharedErrors.InvalidRequestType.Code);
        errorResponse.Detail.Should().Be(GlobalSharedErrors.InvalidRequestType.Description);
    }
}
