using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using SV.Pay.Application.Core.Accounts.ChangeLimit;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Accounts;

public class ChangeDailyLimitTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private Guid _activeAccountId;
    private Guid _blockedAccountId;
    private Guid _inactiveAccountId;
    private const decimal InitialDailyLimit = 500;

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

        var user = userFaker.Generate();
        await DbContext.Users.AddAsync(user);

        // Create test accounts with different statuses
        var accountFaker = new Faker<Account>()
            .RuleFor(a => a.Id, _ => Guid.NewGuid())
            .RuleFor(a => a.UserId, _ => user.Id)
            .RuleFor(a => a.Name, f => f.Finance.AccountName())
            .RuleFor(a => a.Balance, _ => new Money(1000))
            .RuleFor(a => a.DailyLimit, _ => new Money(InitialDailyLimit))
            .RuleFor(a => a.Type, f => f.PickRandom<AccountType>());

        var activeAccount = accountFaker.Generate();
        activeAccount.Status = AccountStatus.Active;
        _activeAccountId = activeAccount.Id;

        var blockedAccount = accountFaker.Generate();
        blockedAccount.Status = AccountStatus.Blocked;
        _blockedAccountId = blockedAccount.Id;

        var inactiveAccount = accountFaker.Generate();
        inactiveAccount.Status = AccountStatus.Inactive;
        _inactiveAccountId = inactiveAccount.Id;

        await DbContext.Accounts.AddRangeAsync(activeAccount, blockedAccount, inactiveAccount);
        await DbContext.SaveChangesAsync();

        // Clear the change tracker to avoid conflicts with the test
        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_ChangeDailyLimit_When_AccountIsActive()
    {
        // Arrange
        var newDailyLimit = 1000m;
        var command = new ChangeDailyLimitCommand(_activeAccountId, newDailyLimit);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        var account = await DbContext.Accounts.FindAsync(_activeAccountId);
        account.Should().NotBeNull();
        account!.DailyLimit.Amount.Should().Be(newDailyLimit);
        account.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_AccountDoesNotExist()
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(Guid.NewGuid(), 1000);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(AccountErrors.NotFound.Code);
        errorResponse.Detail.Should().Be(AccountErrors.NotFound.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_ChangingLimitForBlockedAccount()
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(_blockedAccountId, 1000);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(AccountErrors.AccountIsBlocked.Code);
        errorResponse.Detail.Should().Be(AccountErrors.AccountIsBlocked.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_ChangingLimitForInactiveAccount()
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(_inactiveAccountId, 1000);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(AccountErrors.AccountIsInactive.Code);
        errorResponse.Detail.Should().Be(AccountErrors.AccountIsInactive.Description);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task Should_ReturnBadRequest_When_DailyLimitIsInvalid(decimal invalidLimit)
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(_activeAccountId, invalidLimit);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors
            .Should().Contain(e =>
                e.Code == AccountErrors.AccountDailyLimitIsInvalid.Code &&
                e.Description == AccountErrors.AccountDailyLimitIsInvalid.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_AccountIdIsEmpty()
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(Guid.Empty, 1000);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().NotBeNullOrEmpty();
        errorResponse.Detail.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Should_NotChangePreviousLimit_When_ValidationFails()
    {
        // Arrange
        var command = new ChangeDailyLimitCommand(_activeAccountId, -100);

        // Act
        var response = await HttpClient.PutAsJsonAsync("/api/v1/accounts/limit", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var account = await DbContext.Accounts.FindAsync(_activeAccountId);
        account.Should().NotBeNull();
        account!.DailyLimit.Amount.Should().Be(InitialDailyLimit);
    }
}
