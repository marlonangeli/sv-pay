using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using SV.Pay.Application.Core.Transactions.Withdraw;
using SV.Pay.Data.Context;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Transactions;

public class CreateWithdrawTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private CreateWithdrawCommand _baseRequest = null!;
    private Guid _existingAccountId;
    private Account _existingAccount = null!;

    public async Task InitializeAsync()
    {
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.BirthDate, f => DateOnly.FromDateTime(f.Date.Past(20, DateTime.UtcNow.AddYears(-18))))
            .RuleFor(u => u.CPF, f => new CPF(f.Person.Cpf()));

        var user = userFaker.Generate();

        var accountFaker = new Faker<Account>()
            .RuleFor(a => a.Id, _ => Guid.NewGuid())
            .RuleFor(a => a.UserId, _ => user.Id)
            .RuleFor(a => a.Name, f => f.Finance.AccountName())
            .RuleFor(a => a.Type, f => f.PickRandom<AccountType>())
            .RuleFor(a => a.Balance, f => new Money(1000m)) // Set initial balance for testing withdrawals
            .RuleFor(a => a.DailyLimit, f => new Money(500m))
            .RuleFor(a => a.Status, _ => AccountStatus.Active);

        _existingAccount = accountFaker.Generate();

        await DbContext.Users.AddAsync(user);
        await DbContext.Accounts.AddAsync(_existingAccount);
        await DbContext.SaveChangesAsync();

        _existingAccountId = _existingAccount.Id;

        var commandFaker = new Faker<CreateWithdrawCommand>()
            .CustomInstantiator(f => new(
                AccountId: Guid.NewGuid(),
                Amount: Math.Round(f.Random.Decimal(1, 100), 2),
                Description: f.Lorem.Sentence(3),
                Date: f.Date.Recent()
            ));

        _baseRequest = commandFaker.Generate();

        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_CreateWithdraw_When_RequestIsValid()
    {
        // Arrange
        var initialBalance = _existingAccount.Balance.Amount;
        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var transactionId = await response.Content.ReadFromJsonAsync<Guid>();
        transactionId.Should().NotBeEmpty();
        response.Headers.Location.Should().Be($"/api/v1/transactions/{transactionId}");

        var transaction = await DbContext.Transactions.FindAsync(transactionId);
        transaction.Should().NotBeNull();
        transaction!.AccountId.Should().Be(request.AccountId);
        transaction.Amount.Amount.Should().Be(request.Amount);
        transaction.Description.Should().Be(request.Description);
        transaction.Date.Should().Be(request.Date);
        transaction.Type.Should().Be(TransactionType.Withdraw);
        transaction.RelatedAccountId.Should().BeNull();

        var updatedAccount = await DbContext.Accounts.FindAsync(_existingAccountId);
        updatedAccount!.Balance.Amount.Should().Be(initialBalance - request.Amount);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_AccountIsBlocked()
    {
        // Arrange
        _existingAccount = (await DbContext.Accounts.FindAsync(_existingAccountId))!;
        _existingAccount.Status = AccountStatus.Blocked;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsBlocked.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsBlocked.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_AccountIsInactive()
    {
        // Arrange
        _existingAccount = (await DbContext.Accounts.FindAsync(_existingAccountId))!;
        _existingAccount.Status = AccountStatus.Inactive;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with { AccountId = _existingAccountId };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsInactive.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsInactive.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_InsufficientBalance()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Amount = _existingAccount.Balance.Amount + 100
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.NotEnoughBalance.Code);
        error.Detail.Should().Be(TransactionErrors.NotEnoughBalance.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_DailyLimitExceeded()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Amount = _existingAccount.DailyLimit.Amount + 1
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.NotEnoughLimit.Code);
        error.Detail.Should().Be(TransactionErrors.NotEnoughLimit.Description);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_AccountNotFound()
    {
        // Arrange
        var request = _baseRequest with { AccountId = Guid.NewGuid() };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountNotFound.Code);
        error.Detail.Should().Be(TransactionErrors.AccountNotFound.Description);
    }

    [Theory]
    [InlineData(-100)]
    [InlineData(-1)]
    [InlineData(0)]
    public async Task Should_ReturnBadRequest_When_AmountIsZeroOrNegative(decimal amount)
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Amount = amount
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.NegativeAmount.Code &&
            e.Description == TransactionErrors.NegativeAmount.Description);
    }

    [Theory]
    [InlineData(-5, -1)]
    [InlineData(1, 1)]
    public async Task Should_ReturnBadRequest_When_DateIsInvalid(int yearOffset, int daysOffset)
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _existingAccountId,
            Date = DateTime.UtcNow.AddYears(yearOffset).AddDays(daysOffset)
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/withdraw", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.InvalidDate.Code &&
            e.Description == TransactionErrors.InvalidDate.Description);
    }
}
