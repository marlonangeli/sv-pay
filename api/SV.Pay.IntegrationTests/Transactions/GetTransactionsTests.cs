using System.Net;
using System.Net.Http.Json;
using Bogus;
using Bogus.Extensions.Brazil;
using FluentAssertions;
using SV.Pay.Domain;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.IntegrationTests.Abstractions;
using SV.Pay.IntegrationTests.Extensions;
using SV.Pay.Shared;

namespace SV.Pay.IntegrationTests.Transactions;

public class GetTransactionTests(IntegrationTestWebAppFactory factory) : BaseIntegrationTest(factory), IAsyncLifetime
{
    private List<Transaction> _transactions = null!;
    private Account _account = null!;
    private Account _relatedAccount = null!;

    public async Task InitializeAsync()
    {
        // Create test accounts
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Id, _ => Guid.NewGuid())
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FirstName, u.LastName))
            .RuleFor(u => u.BirthDate, f => DateOnly.FromDateTime(f.Date.Past(20, DateTime.UtcNow.AddYears(-18))))
            .RuleFor(u => u.CPF, f => new CPF(f.Person.Cpf()));

        var accountFaker = new Faker<Account>()
            .RuleFor(a => a.Id, _ => Guid.NewGuid())
            .RuleFor(a => a.UserId, _ => Guid.NewGuid())
            .RuleFor(a => a.Name, f => f.Finance.AccountName())
            .RuleFor(a => a.Type, f => f.PickRandom<AccountType>())
            .RuleFor(a => a.Balance, f => new Money(1000))
            .RuleFor(a => a.DailyLimit, f => new Money(500))
            .RuleFor(a => a.Status, _ => AccountStatus.Active);

        var user = userFaker.Generate();
        var otherUser = userFaker.Generate();
        _account = accountFaker.Generate();
        _account.UserId = user.Id;
        _relatedAccount = accountFaker.Generate();
        _relatedAccount.UserId = otherUser.Id;

        await DbContext.Users.AddRangeAsync(user, otherUser);
        await DbContext.Accounts.AddRangeAsync(_account, _relatedAccount);
        await DbContext.SaveChangesAsync();

        // Create test transactions
        var transactionFaker = new Faker<Transaction>()
            .RuleFor(t => t.Id, _ => Guid.NewGuid())
            .RuleFor(t => t.AccountId, _ => _account.Id)
            .RuleFor(t => t.Amount, f => new Money(f.Random.Decimal(10, 1000)))
            .RuleFor(t => t.Description, f => f.Lorem.Sentence())
            .RuleFor(t => t.Date, f => f.Date.Between(DateTime.UtcNow.AddMonths(-2), DateTime.UtcNow))
            .RuleFor(t => t.Type, f => f.PickRandom<TransactionType>());

        // Generate regular transactions
        var regularTransactions = transactionFaker.Generate(5);

        // Generate transfer transactions
        var transferTransactionFaker = transactionFaker.Clone()
            .RuleFor(t => t.Type, _ => TransactionType.Transfer)
            .RuleFor(t => t.RelatedAccountId, _ => _relatedAccount.Id);

        var transferTransactions = transferTransactionFaker.Generate(5);

        _transactions = regularTransactions.Concat(transferTransactions).ToList();

        await DbContext.Transactions.AddRangeAsync(_transactions);
        await DbContext.SaveChangesAsync();

        DbContext.ChangeTracker.Clear();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    [Fact]
    public async Task Should_ReturnTransaction_When_GetById()
    {
        // Arrange
        var existingTransaction = _transactions[0];

        // Act
        var response = await HttpClient.GetAsync($"/api/v1/transactions/{existingTransaction.Id}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var transaction = await response.GetContent<Transaction>();

        transaction.Should().NotBeNull();
        transaction!.Id.Should().Be(existingTransaction.Id);
        transaction.AccountId.Should().Be(existingTransaction.AccountId);
        transaction.Amount.Should().Be(existingTransaction.Amount);
        transaction.Description.Should().Be(existingTransaction.Description);
        transaction.Date.Should().Be(existingTransaction.Date);
        transaction.Type.Should().Be(existingTransaction.Type);
        transaction.RelatedAccountId.Should().Be(existingTransaction.RelatedAccountId);
    }

    [Fact]
    public async Task Should_ReturnNotFound_When_TransactionDoesNotExist()
    {
        // Act
        var response = await HttpClient.GetAsync($"/api/v1/transactions/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var error = await response.GetProblemDetails();
        error.Title.Should().Be(TransactionErrors.NotFound(Guid.NewGuid()).Code);
    }

    [Fact]
    public async Task Should_ReturnTransactions_When_GetByPeriod()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddMonths(-1);
        var endDate = DateTime.UtcNow;
        var expectedTransactions = _transactions
            .Where(t =>
                (t.AccountId == _account.Id || t.RelatedAccountId == _account.Id) &&
                t.Date >= startDate && t.Date <= endDate)
            .OrderByDescending(t => t.Date)
            .ToList();

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_account.Id}?startDate={startDate:s}&endDate={endDate:s}&page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.GetContent<Pagination<Transaction>>();

        result.Should().NotBeNull();
        result!.Items.Should().HaveCount(expectedTransactions.Count);
        result.TotalCount.Should().Be(expectedTransactions.Count);
        result.Page.Should().Be(1);
        result.PageSize.Should().Be(10);

        // Verify first item matches and ordering is correct
        var firstTransaction = result.Items[0];
        var expectedFirst = expectedTransactions[0];
        firstTransaction.Date.Should().BeOnOrAfter(result.Items[0].Date);
        firstTransaction.Should().BeEquivalentTo(expectedFirst,
            options => options
                .Excluding(t => t.Account)
                .Excluding(t => t.RelatedAccount)
                .Excluding(t => t.CreatedAt)
                .Excluding(t => t.UpdatedAt));
    }

    [Fact]
    public async Task Should_ReturnTransactions_When_GetByPeriodWithPagination()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddMonths(-2);
        var endDate = DateTime.UtcNow;
        const int pageSize = 5;
        const int page = 2;

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_account.Id}?startDate={startDate:s}&endDate={endDate:s}&page={page}&pageSize={pageSize}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.GetContent<Pagination<Transaction>>();

        result.Should().NotBeNull();
        result!.Items.Should().HaveCountLessThanOrEqualTo(pageSize);
        result.Page.Should().Be(page);
        result.PageSize.Should().Be(pageSize);
    }

    [Theory]
    [InlineData(0, 10)] // Invalid page
    [InlineData(1, 0)] // Invalid page size
    [InlineData(1, 101)] // Page size too large
    public async Task Should_ReturnBadRequest_When_PaginationParametersAreInvalid(int page, int pageSize)
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddDays(-7);
        var endDate = DateTime.UtcNow;

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_account.Id}?startDate={startDate:s}&endDate={endDate:s}&page={page}&pageSize={pageSize}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e =>
            e.Code == GlobalSharedErrors.InvalidPageNumber.Code ||
            e.Code == GlobalSharedErrors.InvalidPageSize.Code);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_DateRangeExceedsOneYear()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddYears(-2);
        var endDate = DateTime.UtcNow;

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_account.Id}?startDate={startDate:s}&endDate={endDate:s}&page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e => e.Code == TransactionErrors.InvalidPeriodInterval.Code);
    }

    [Fact]
    public async Task Should_ReturnBadRequest_When_StartDateIsAfterEndDate()
    {
        // Arrange
        var startDate = DateTime.UtcNow;
        var endDate = DateTime.UtcNow.AddDays(-7);

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_account.Id}?startDate={startDate:s}&endDate={endDate:s}&page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        var error = await response.GetCustomProblemDetails();
        error.Errors.Should().Contain(e => e.Code == TransactionErrors.InvalidPeriodDate.Code);
    }

    [Fact]
    public async Task Should_IncludeTransfers_When_AccountIsRelatedAccount()
    {
        // Arrange
        var startDate = DateTime.UtcNow.AddMonths(-2);
        var endDate = DateTime.UtcNow;
        var transferTransactions = _transactions
            .Where(t => (t.AccountId == _relatedAccount.Id || t.RelatedAccountId == _relatedAccount.Id) &&
                        t.Type == TransactionType.Transfer &&
                        t.Date >= startDate && t.Date <= endDate).ToList();

        // Act
        var response = await HttpClient.GetAsync(
            $"/api/v1/transactions/account/{_relatedAccount.Id}?startDate={startDate:s}&endDate={endDate:s}&page=1&pageSize=10");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.GetContent<Pagination<Transaction>>();

        result.Should().NotBeNull();
        result!.Items.Should().HaveCount(transferTransactions.Count);
        result.Items.Should().OnlyContain(t => t.Type == TransactionType.Transfer);
        result.Items.Should().OnlyContain(t => t.RelatedAccountId == _relatedAccount.Id);
    }
}
