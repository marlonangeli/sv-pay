using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.Create;

internal sealed class CreateAccountHandler(IPaymentsDbContext context) : ICommandHandler<CreateAccountCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        await using var dbTransaction = await context.Instance.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            bool userExists = await context.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
            if (!userExists)
                return Result.Failure<Guid>(AccountErrors.UserNotFound);

            Account account = new()
            {
                UserId = request.UserId,
                DailyLimit = new Money(request.DailyLimit),
                Balance = new Money(0), // Initial balance is 0
                Name = request.Name,
                Status = AccountStatus.Active,
                Type = request.Type
            };

            context.Accounts.Add(account);

            if (request.InitialBalance > 0)
            {
                Transaction initialDeposit = new()
                {
                    AccountId = account.Id,
                    Amount = new Money(request.InitialBalance),
                    Description = "Initial deposit",
                    Date = DateTime.UtcNow,
                    Type = TransactionType.Deposit,
                    RelatedAccountId = null
                };

                account.Balance += initialDeposit.Amount;
                context.Transactions.Add(initialDeposit);
            }

            await context.SaveChangesAsync(cancellationToken);
            await dbTransaction.CommitAsync(cancellationToken);

            return account.Id;
        }
        catch (DbUpdateException)
        {
            await dbTransaction.RollbackAsync(cancellationToken);
            return Result.Failure<Guid>(Error.Problem("Account.Create",
                "An error occurred while creating the account"));
        }
    }
}
