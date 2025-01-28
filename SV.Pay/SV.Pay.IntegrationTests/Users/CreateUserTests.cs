using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using SV.Pay.Application.Core.Users.Create;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Users;

public class CreateUserTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory)
{
    private readonly CreateUserCommand _baseRequest = new(
        FirstName: "Elon",
        LastName: "Musk",
        Email: "elon.musk@x.com",
        DateOfBirth: DateTime.Parse("1971-06-28"),
        CPF: "447.658.370-92"
    );

    private readonly CreateUserCommand _otherRequest = new(
        FirstName: "Jeff",
        LastName: "Bezos",
        Email: "jeff.bezos@amazon.com",
        DateOfBirth: DateTime.Parse("1964-01-12"),
        CPF: "748.025.860-78"
    );

    [Fact]
    public async Task Should_ReturnBadRequest_When_EmailIsInvalid()
    {
        // Arrange
        object request = _baseRequest with { Email = "invalid-email" };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidEmail.Code &&
                e.Description == UserErrors.InvalidEmail.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_EmailIsNotUnique()
    {
        // Arrange
        object request = _baseRequest with { Email = "not-unique@email.com" };

        await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        object request2 = _otherRequest with { Email = "not-unique@email.com" };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request2);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(UserErrors.EmailNotUnique.Code);
        errorResponse.Detail.Should().Be(UserErrors.EmailNotUnique.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_CPFIsInvalid()
    {
        // Arrange
        object request = _baseRequest with { CPF = "123.456.789-10" };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.InvalidCPF.Code &&
                e.Description == UserErrors.InvalidCPF.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_CPFIsNotUnique()
    {
        // Arrange
        object request = _baseRequest with { CPF = "246.176.020-97" };

        await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        object request2 = _otherRequest with { CPF = "246.176.020-97" };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request2);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(UserErrors.CPFNotUnique.Code);
        errorResponse.Detail.Should().Be(UserErrors.CPFNotUnique.Description);
    }

    // DateTime is not a valid input for InlineData
    [Fact]
    public async Task Should_ReturnBadRequest_When_BirthDateIsInvalid()
    {
        DateTime[] invalidDates =
            [DateTime.Today, DateTime.Today.AddDays(1), DateTime.Today.AddYears(-150)];

        foreach (DateTime date in invalidDates)
        {
            // Arrange
            object request = _baseRequest with { DateOfBirth = date };

            // Act
            var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var errorResponse = await response.GetCustomProblemDetails();
            errorResponse.Errors
                .Should().Contain(e =>
                    e.Code == UserErrors.InvalidBirthDate.Code &&
                    e.Description == UserErrors.InvalidBirthDate.Description);
        }
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_FirstNameIsEmpty()
    {
        // Arrange
        object request = _baseRequest with { FirstName = string.Empty };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.NameIsRequired.Code &&
                e.Description == UserErrors.NameIsRequired.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_LastNameIsEmpty()
    {
        // Arrange
        object request = _baseRequest with { LastName = string.Empty };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == UserErrors.NameIsRequired.Code &&
                e.Description == UserErrors.NameIsRequired.Description);
    }

    [Fact]
    public async Task Should_CreateUser_When_RequestIsValid()
    {
        // Arrange
        object request = _baseRequest with
        {
            Email = "valid@x.com",
            CPF = "661.588.340-68"
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/users", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        Guid userId = await response.Content.ReadFromJsonAsync<Guid>();
        userId.Should().NotBeEmpty();

        var user = await HttpClient.GetFromJsonAsync<User>($"/api/v1/users/{userId}");
        user.Should().NotBeNull();
        user.Id.Should().Be(userId);
        user.FirstName.Should().Be(_baseRequest.FirstName);
        user.LastName.Should().Be(_baseRequest.LastName);
        user.Email.Should().Be("valid@x.com");
        user.CPF.Should().Be(new CPF("661.588.340-68"));
        user.BirthDate.Should().Be(DateOnly.FromDateTime(_baseRequest.DateOfBirth));
    }
}
