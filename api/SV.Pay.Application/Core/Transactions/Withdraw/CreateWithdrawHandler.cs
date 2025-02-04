using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions.Withdraw;

internal sealed class CreateWithdrawHandler(IPaymentsDbContext context) : ICommandHandler<CreateWithdrawCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateWithdrawCommand request, CancellationToken cancellationToken)
    {
        await using var dbTransaction = await context.Instance.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var account = await context.Accounts
                .Where(a => a.Id == request.AccountId)
                .FirstOrDefaultAsync(cancellationToken);

            switch (account)
            {
                case null:
                    return Result.Failure<Guid>(TransactionErrors.AccountNotFound);
                case { Status: AccountStatus.Blocked }:
                    return Result.Failure<Guid>(TransactionErrors.AccountIsBlocked);
                case { Status: AccountStatus.Inactive }:
                    return Result.Failure<Guid>(TransactionErrors.AccountIsInactive);
            }

            Transaction transaction = new()
            {
                AccountId = request.AccountId,
                Amount = new Money(request.Amount),
                Description = request.Description,
                Date = request.Date,
                Type = TransactionType.Withdraw,
                RelatedAccountId = null
            };

            if (account.Balance < transaction.Amount)
                return Result.Failure<Guid>(TransactionErrors.NotEnoughBalance);

            var pastTransactions = await context.Transactions
                .Where(t => t.AccountId == request.AccountId &&
                            t.Date.Date == request.Date.Date &&
                            (t.Type == TransactionType.Withdraw || t.Type == TransactionType.Transfer))
                .Select(s => s.Amount)
                .ToListAsync(cancellationToken);

            if (pastTransactions.Sum(m => m) + transaction.Amount > account.DailyLimit)
                return Result.Failure<Guid>(TransactionErrors.NotEnoughLimit);

            account.Balance -= transaction.Amount;

            context.Transactions.Add(transaction);
            await context.SaveChangesAsync(cancellationToken);

            await dbTransaction.CommitAsync(cancellationToken);

            return transaction.Id;
        }
        catch (DbUpdateConcurrencyException e)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return Result.Failure<Guid>(TransactionErrors.ConcurrencyError);
        }
    }
}
