using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using SV.Pay.Application.Core.Transactions.Deposit;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Transactions;

public class CreateDepositTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private CreateDepositCommand _baseRequest = null!;
    private Guid _existingAccountId;
    private Account _existingAccount = null!;

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

        // Create an account for testing
        var accountFaker = new Faker<Account>()
            .RuleFor(a => a.Id, _ => Guid.NewGuid())
            .RuleFor(a => a.UserId, _ => user.Id)
            .RuleFor(a => a.Name, f => f.Finance.AccountName())
            .RuleFor(a => a.Type, f => f.PickRandom<AccountType>())
            .RuleFor(a => a.Balance, f => new Money(Math.Round(f.Random.Decimal(0, 10000), 2)))
            .RuleFor(a => a.DailyLimit, f => new Money(Math.Round(f.Random.Decimal(1, 1000), 2)))
            .RuleFor(a => a.Status, _ => AccountStatus.Active);

        _existingAccount = accountFaker.Generate();

        await DbContext.Users.AddAsync(user);
        await DbContext.Accounts.AddAsync(_existingAccount);
        await DbContext.SaveChangesAsync();

        _existingAccountId = _existingAccount.Id;

        var commandFaker = new Faker<CreateDepositCommand>()
            .CustomInstantiator(f => new(
                AccountId: Guid.NewGuid(),
                Amount: Math.Round(f.Random.Decimal(1, 1000), 2),
                Description: f.Lorem.Sentence(3),
                Date: f.Date.Recent()
            ));

        _baseRequest = commandFaker.Generate();

        // Clear the change tracker to avoid conflicts with the database
        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_CreateDeposit_When_RequestIsValid()
    {
        // Arrange
        var initialBalance = _existingAccount.Balance.Amount;
        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var transactionId = await response.Content.ReadFromJsonAsync<Guid>();
        transactionId.Should().NotBeEmpty();

        var transaction = await DbContext.Transactions.FindAsync(transactionId);
        transaction.Should().NotBeNull();
        transaction!.AccountId.Should().Be(request.AccountId);
        transaction.Amount.Amount.Should().Be(request.Amount);
        transaction.Description.Should().Be(request.Description);
        transaction.Date.Should().Be(request.Date);
        transaction.Type.Should().Be(TransactionType.Deposit);
        transaction.RelatedAccountId.Should().BeNull();

        var updatedAccount = await DbContext.Accounts.FindAsync(_existingAccountId);
        updatedAccount!.Balance.Amount.Should().Be(initialBalance + request.Amount);
    }

    [Fact]
    public async Task Should_ReturnError_When_AccountNotFound()
    {
        // Arrange
        var request = _baseRequest with { AccountId = Guid.NewGuid() };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountNotFound.Code);
        error.Detail.Should().Be(TransactionErrors.AccountNotFound.Description);
    }

    [Fact]
    public async Task Should_ReturnError_When_AccountIsBlocked()
    {
        // Arrange
        _existingAccount = (await DbContext.Accounts.FindAsync(_existingAccountId))!;
        _existingAccount.Status = AccountStatus.Blocked;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsBlocked.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsBlocked.Description);
    }

    [Fact]
    public async Task Should_ReturnError_When_AccountIsInactive()
    {
        // Arrange
        _existingAccount = (await DbContext.Accounts.FindAsync(_existingAccountId))!;
        _existingAccount.Status = AccountStatus.Inactive;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsInactive.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsInactive.Description);
    }

    [Theory]
    [InlineData(-100)]
    [InlineData(0)]
    public async Task Should_ReturnError_When_AmountIsInvalid(decimal amount)
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Amount = amount
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.NegativeAmount.Code &&
            e.Description == TransactionErrors.NegativeAmount.Description);
    }

    [Fact]
    public async Task Should_ReturnError_When_DescriptionIsEmpty()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Description = string.Empty
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.DescriptionIsRequired.Code &&
            e.Description == TransactionErrors.DescriptionIsRequired.Description);
    }

    [Theory]
    [InlineData(-6)]  // More than 5 years ago
    [InlineData(2)]   // More than 1 year in future
    public async Task Should_ReturnError_When_DateIsInvalid(int yearOffset)
    {
        // Arrange
        var invalidDate = DateTime.Today.AddYears(yearOffset);
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Date = invalidDate
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/deposit", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.InvalidDate.Code &&
            e.Description == TransactionErrors.InvalidDate.Description);
    }
}
