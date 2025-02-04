using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using SV.Pay.Application.Core.Transactions.Transfer;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;

namespace SV.Pay.IntegrationTests.Transactions;

public class CreateTransferTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private CreateTransferCommand _baseRequest = null!;
    private Guid _sourceAccountId;
    private Guid _targetAccountId;
    private Account _sourceAccount = null!;
    private Account _targetAccount = null!;

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
            .RuleFor(a => a.Status, _ => AccountStatus.Active);

        _sourceAccount = accountFaker.Generate();
        _sourceAccount.Balance = new Money(1000);
        _sourceAccount.DailyLimit = new Money(500);

        _targetAccount = accountFaker.Generate();
        _targetAccount.Balance = new Money(500);
        _targetAccount.DailyLimit = new Money(500);

        await DbContext.Users.AddAsync(user);
        await DbContext.Accounts.AddAsync(_sourceAccount);
        await DbContext.Accounts.AddAsync(_targetAccount);
        await DbContext.SaveChangesAsync();

        _sourceAccountId = _sourceAccount.Id;
        _targetAccountId = _targetAccount.Id;

        var commandFaker = new Faker<CreateTransferCommand>()
            .CustomInstantiator(f => new(
                AccountId: Guid.NewGuid(),
                Amount: Math.Round(f.Random.Decimal(1, 100), 2),
                Description: f.Lorem.Sentence(3),
                Date: f.Date.Recent(),
                RelatedAccountId: Guid.NewGuid()
            ));

        _baseRequest = commandFaker.Generate();

        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_CreateTransfer_When_RequestIsValid()
    {
        // Arrange
        var sourceInitialBalance = _sourceAccount.Balance.Amount;
        var targetInitialBalance = _targetAccount.Balance.Amount;
        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

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
        transaction.Type.Should().Be(TransactionType.Transfer);
        transaction.RelatedAccountId.Should().Be(request.RelatedAccountId);

        var updatedSourceAccount = await DbContext.Accounts.FindAsync(_sourceAccountId);
        var updatedTargetAccount = await DbContext.Accounts.FindAsync(_targetAccountId);
        updatedSourceAccount!.Balance.Amount.Should().Be(sourceInitialBalance - request.Amount);
        updatedTargetAccount!.Balance.Amount.Should().Be(targetInitialBalance + request.Amount);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_SourceAccountNotFound()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = Guid.NewGuid(),
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountNotFound.Code);
        error.Detail.Should().Be(TransactionErrors.AccountNotFound.Description);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_TargetAccountNotFound()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = Guid.NewGuid()
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountNotFound.Code);
        error.Detail.Should().Be(TransactionErrors.AccountNotFound.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_SourceAccountHasInsufficientBalance()
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId,
            Amount = _sourceAccount.Balance.Amount + 100
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.NotEnoughBalance.Code);
        error.Detail.Should().Be(TransactionErrors.NotEnoughBalance.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_TargetAccountIsBlocked()
    {
        // Arrange
        _targetAccount = (await DbContext.Accounts.FindAsync(_targetAccountId))!;
        _targetAccount.Status = AccountStatus.Blocked;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsBlocked.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsBlocked.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_TargetAccountIsInactive()
    {
        // Arrange
        _targetAccount = (await DbContext.Accounts.FindAsync(_targetAccountId))!;
        _targetAccount.Status = AccountStatus.Inactive;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsInactive.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsInactive.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_SourceAccountIsBlocked()
    {
        // Arrange
        _sourceAccount = (await DbContext.Accounts.FindAsync(_sourceAccountId))!;
        _sourceAccount.Status = AccountStatus.Blocked;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsBlocked.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsBlocked.Description);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_SourceAccountIsInactive()
    {
        // Arrange
        _sourceAccount = (await DbContext.Accounts.FindAsync(_sourceAccountId))!;
        _sourceAccount.Status = AccountStatus.Inactive;
        await DbContext.SaveChangesAsync();

        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.AccountIsInactive.Code);
        error.Detail.Should().Be(TransactionErrors.AccountIsInactive.Description);
    }

    [Theory]
    [InlineData(-100)]
    [InlineData(-1)]
    [InlineData(0)]
    public async Task Should_ReturnBadRequest_When_AmountIsZeroOrNegative(decimal amount)
    {
        // Arrange
        var request = _baseRequest with {
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId,
            Amount = amount
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

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
            AccountId = _sourceAccountId,
            RelatedAccountId = _targetAccountId,
            Date = DateTime.UtcNow.AddYears(yearOffset).AddDays(daysOffset)
        };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/transactions/transfer", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == TransactionErrors.InvalidDate.Code &&
            e.Description == TransactionErrors.InvalidDate.Description);
    }
}
