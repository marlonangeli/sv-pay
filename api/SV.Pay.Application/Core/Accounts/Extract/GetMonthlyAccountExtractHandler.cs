using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.Extract;

internal sealed class GetMonthlyAccountExtractHandler(IPaymentsDbContext context)
    : IQueryHandler<GetMonthlyAccountExtractQuery, MonthlyAccountExtract>
{
    public async Task<Result<MonthlyAccountExtract>> Handle(
        GetMonthlyAccountExtractQuery request,
        CancellationToken cancellationToken)
    {
        var account = await context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.AccountId, cancellationToken);

        if (account is null)
            return Result.Failure<MonthlyAccountExtract>(AccountErrors.UserNotFound);

        var (startDate, endDate) = GetDateRange(request.Year, request.Month);

        try
        {
            var (transactions, initialBalance) = await GetTransactionsAndInitialBalance(
                request.AccountId,
                startDate,
                endDate,
                cancellationToken);

            var (totalIncome, totalOutcome) = CalculateIncomeAndOutcome(transactions, request.AccountId);
            var finalBalance = initialBalance + totalIncome - totalOutcome;

            var extract = new MonthlyAccountExtract(
                InitialBalance: new Money(initialBalance),
                FinalBalance: new Money(finalBalance),
                TotalIncome: new Money(totalIncome),
                TotalOutcome: new Money(totalOutcome),
                Transactions: transactions,
                StartDate: startDate,
                EndDate: endDate);

            return Result.Success(extract);
        }
        catch (Exception ex)
        {
            return Result.Failure<MonthlyAccountExtract>(Error.Failure("MonthlyExtract.Error",
                $"Failed to generate monthly extract: {ex.Message}"));
        }
    }

    private static (DateTime startDate, DateTime endDate) GetDateRange(int year, int month)
    {
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);
        return (startDate, endDate);
    }

    private async Task<(List<Transaction> transactions, decimal initialBalance)> GetTransactionsAndInitialBalance(
        Guid accountId,
        DateTime startDate,
        DateTime endDate,
        CancellationToken cancellationToken)
    {
        var transactionsPreviousEndDate = await context.Transactions
            .AsNoTracking()
            .Include(t => t.RelatedAccount)
            .Include(t => t.Account)
            .Where(GetAccountTransactionsPredicate(accountId, endDate))
            .OrderBy(o => o.Date)
            .ToListAsync(cancellationToken);

        var transactions = transactionsPreviousEndDate
            .Where(x => x.Date >= startDate && x.Date <= endDate)
            .OrderBy(o => o.Date)
            .ToList();

        var initialBalance = transactionsPreviousEndDate
            .Where(x => x.Date < startDate)
            .Sum(x => CalculateAmount(x, accountId));

        return (transactions, initialBalance);
    }

    private static (decimal totalIncome, decimal totalOutcome) CalculateIncomeAndOutcome(
        IEnumerable<Transaction> transactions,
        Guid accountId)
    {
        decimal totalIncome = 0;
        decimal totalOutcome = 0;

        foreach (var transaction in transactions)
        {
            decimal amount = transaction.Amount;

            switch (transaction.Type)
            {
                case TransactionType.Deposit:
                    totalIncome += amount;
                    break;
                case TransactionType.Withdraw:
                    totalOutcome += amount;
                    break;
                case TransactionType.Transfer:
                    if (transaction.AccountId == accountId)
                        totalOutcome += amount;
                    else
                        totalIncome += amount;
                    break;
            }
        }

        return (totalIncome, totalOutcome);
    }

    private static Expression<Func<Transaction, bool>> GetAccountTransactionsPredicate(
        Guid accountId,
        DateTime endDate) =>
        x => (x.AccountId == accountId || x.RelatedAccountId == accountId) &&
             x.Date <= endDate.Date;

    private static decimal CalculateAmount(Transaction transaction, Guid accountId) =>
        transaction.Type switch
        {
            TransactionType.Deposit => transaction.Amount,
            TransactionType.Withdraw => -transaction.Amount,
            TransactionType.Transfer when transaction.AccountId == accountId => -transaction.Amount,
            TransactionType.Transfer when transaction.RelatedAccountId == accountId => transaction.Amount,
            _ => 0
        };
}
