using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions.Deposit;

internal sealed class CreateDepositTransactionHandler(IPaymentsDbContext context)
    : ICommandHandler<CreateDepositCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateDepositCommand request, CancellationToken cancellationToken)
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
                Date = (request.Date),
                Type = TransactionType.Deposit,
                RelatedAccountId = null
            };

            account.Balance += transaction.Amount;

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
