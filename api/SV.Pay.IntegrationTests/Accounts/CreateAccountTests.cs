using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Core.Accounts.Create;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Accounts;

public class CreateAccountTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private CreateAccountCommand _baseRequest = null!;
    private Guid _existingUserId;

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
        await DbContext.SaveChangesAsync();
        _existingUserId = user.Id;

        var commandFaker = new Faker<CreateAccountCommand>()
            .CustomInstantiator(f => new(
                UserId: Guid.NewGuid(),
                Name: f.Finance.AccountName(),
                Type: f.PickRandom<AccountType>(),
                InitialBalance: Math.Round(f.Random.Decimal(0, 10000), 2),
                DailyLimit: Math.Round(f.Random.Decimal(1, 1000), 2)
            ));

        _baseRequest = commandFaker.Generate();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_CreateAccount_When_RequestIsValid()
    {
        // Arrange
        var request = _baseRequest with { UserId = _existingUserId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
        var accountId = await response.Content.ReadFromJsonAsync<Guid>();
        accountId.Should().NotBeEmpty();
        response.Headers.Location.Should().Be($"/api/v1/accounts/{accountId}");

        var account = await DbContext.Accounts.FindAsync(accountId);
        account.Should().NotBeNull();
        account!.UserId.Should().Be(request.UserId);
        account.Name.Should().Be(request.Name);
        account.Type.Should().Be(request.Type);
        account.DailyLimit.Amount.Should().Be(request.DailyLimit);
        account.Balance.Amount.Should().Be(request.InitialBalance);
        account.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        account.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_UserDoesNotExist()
    {
        // Clean
        await DbContext.Accounts.ExecuteDeleteAsync();

        // Arrange
        var request = _baseRequest with { UserId = Guid.NewGuid() };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var errorResponse = await response.GetProblemDetails();
        errorResponse.Title.Should().Be(AccountErrors.UserNotFound.Code);
        errorResponse.Detail.Should().Be(AccountErrors.UserNotFound.Description);

        // Verify no account was created
        var accounts = await DbContext.Accounts.ToListAsync();
        accounts.Should().BeEmpty();
    }

    [Theory]
    [InlineData(-100)]
    [InlineData(-1)]
    public async Task Should_ReturnBadRequest_When_InitialBalanceIsNegative(decimal initialBalance)
    {
        // Arrange
        var request = _baseRequest with
        {
            UserId = _existingUserId,
            InitialBalance = initialBalance
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors.Should().Contain(e =>
            e.Code == AccountErrors.AccountInitialBalanceIsInvalid.Code &&
            e.Description == AccountErrors.AccountInitialBalanceIsInvalid.Description);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task Should_ReturnBadRequest_When_DailyLimitIsInvalid(decimal dailyLimit)
    {
        // Arrange
        var request = _baseRequest with
        {
            UserId = _existingUserId,
            DailyLimit = dailyLimit
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors.Should().Contain(e =>
            e.Code == AccountErrors.AccountDailyLimitIsInvalid.Code &&
            e.Description == AccountErrors.AccountDailyLimitIsInvalid.Description);
    }

    [Theory]
    [InlineData("")] // Empty
    [InlineData(null)] // Null
    [InlineData("ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ")] // 52 characters
    public async Task Should_ReturnBadRequest_When_NameIsInvalid(string name)
    {
        // Arrange
        var request = _baseRequest with
        {
            UserId = _existingUserId,
            Name = name
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var errorResponse = await response.GetCustomProblemDetails();
        errorResponse.Errors.Should().Contain(e =>
            e.Code == AccountErrors.AccountNameIsInvalid.Code &&
            e.Description == AccountErrors.AccountNameIsInvalid.Description);
    }

    [Fact]
    public async Task Should_CreateInitialDepositTransaction_When_InitialBalanceIsPositive()
    {
        // Arrange
        var request = _baseRequest with
        {
            UserId = _existingUserId,
            InitialBalance = 1000m
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var accountId = await response.Content.ReadFromJsonAsync<Guid>();

        var transaction = await DbContext.Transactions
            .FirstOrDefaultAsync(t => t.AccountId == accountId && t.Type == TransactionType.Deposit);

        transaction.Should().NotBeNull();
        transaction!.Amount.Amount.Should().Be(request.InitialBalance);
        transaction.Description.Should().Be("Initial deposit");
        transaction.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task Should_NotCreateTransaction_When_InitialBalanceIsZero()
    {
        // Arrange
        var request = _baseRequest with
        {
            UserId = _existingUserId,
            InitialBalance = 0m
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/accounts", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var accountId = await response.Content.ReadFromJsonAsync<Guid>();

        var transaction = await DbContext.Transactions
            .FirstOrDefaultAsync(t => t.AccountId == accountId);

        transaction.Should().BeNull();
    }
}
