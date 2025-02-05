using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Accounts;

public class GetAccountByIdTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private Account _existingAccount = null!;
    private User _user = null!;

    public async Task InitializeAsync()
    {
        // Generate a valid user with Bogus
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.BirthDate, f => DateOnly.FromDateTime(f.Date.Past(20, DateTime.UtcNow.AddYears(-18))))
            .RuleFor(u => u.CPF, f => new CPF(f.Person.Cpf()));

        _user = userFaker.Generate();
        await DbContext.Users.AddAsync(_user);

        // Create test account
        var accountFaker = new Faker<Account>()
            .RuleFor(a => a.Id, _ => Guid.NewGuid())
            .RuleFor(a => a.UserId, _ => _user.Id)
            .RuleFor(a => a.Name, f => f.Finance.AccountName())
            .RuleFor(a => a.Balance, f => new Money(Math.Round(f.Random.Decimal(100, 10000), 2)))
            .RuleFor(a => a.DailyLimit, f => new Money(Math.Round(f.Random.Decimal(1, 1000), 2)))
            .RuleFor(a => a.Type, f => f.PickRandom<AccountType>())
            .RuleFor(a => a.Status, f => f.PickRandom<AccountStatus>());

        _existingAccount = accountFaker.Generate();
        await DbContext.Accounts.AddAsync(_existingAccount);
        await DbContext.SaveChangesAsync();

        // Clear the change tracker to avoid conflicts with the test
        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_ReturnAccount_When_AccountExists()
    {
        // Act
        var response = await HttpClient.GetAsync($"/api/v1/accounts/{_existingAccount.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var account = await response.GetContent<Account>();

        account.Should().NotBeNull();
        account!.Id.Should().Be(_existingAccount.Id);
        account.UserId.Should().Be(_existingAccount.UserId);
        account.Name.Should().Be(_existingAccount.Name);
        account.Balance.Amount.Should().Be(_existingAccount.Balance.Amount);
        account.DailyLimit.Amount.Should().Be(_existingAccount.DailyLimit.Amount);
        account.Type.Should().Be(_existingAccount.Type);
        account.Status.Should().Be(_existingAccount.Status);
        account.CreatedAt.Should().BeCloseTo(_existingAccount.CreatedAt, TimeSpan.FromSeconds(2));
        account.UpdatedAt.Should().BeCloseTo(_existingAccount.UpdatedAt, TimeSpan.FromSeconds(2));
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_AccountDoesNotExist()
    {
        // Arrange
        var nonExistentAccountId = Guid.NewGuid();

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/accounts/{nonExistentAccountId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(AccountErrors.NotFound.Code);
        errorResponse.Detail.Should().Be(AccountErrors.NotFound.Description);
    }

    [Fact]
    public async Task Should_ReturnInternalServerError_When_AccountIdIsInvalid()
    {
        // Act
        var response = await HttpClient.GetAsync("/api/v1/accounts/invalid-guid");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task Should_ReturnAccount_WithCorrectMoneyFormatting()
    {
        // Act
        var response = await HttpClient.GetAsync($"/api/v1/accounts/{_existingAccount.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var account = await response.GetContent<Account>();

        account.Should().NotBeNull();
        account!.Balance.Amount.Should().Be(Math.Round(_existingAccount.Balance.Amount, 2));
        account.DailyLimit.Amount.Should().Be(Math.Round(_existingAccount.DailyLimit.Amount, 2));
    }

    [Fact]
    public async Task Should_ReturnAccount_WithCorrectDateTimeFormatting()
    {
        // Act
        var response = await HttpClient.GetAsync($"/api/v1/accounts/{_existingAccount.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var account = await response.GetContent<Account>();

        account.Should().NotBeNull();
        account!.CreatedAt.Kind.Should().Be(DateTimeKind.Utc);
        account.UpdatedAt.Kind.Should().Be(DateTimeKind.Utc);
    }
}
