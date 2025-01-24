using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.Block;

internal sealed class BlockAccountHandler(IPaymentsDbContext context) : ICommandHandler<BlockAccountCommand>
{
    public async Task<Result> Handle(BlockAccountCommand request, CancellationToken cancellationToken)
    {
        Account? account = await context.Accounts
            .Where(a => a.Id == request.AccountId)
            .FirstOrDefaultAsync(cancellationToken);

        switch (account)
        {
            case null:
                return Result.Failure(AccountErrors.NotFound);
            case { Status: AccountStatus.Blocked } when !request.Unlock:
                return Result.Failure(AccountErrors.AccountIsBlocked);
            case { Status: AccountStatus.Active }:
                return Result.Failure(AccountErrors.AccountIsInactive);
        }

        account.Status = request.Unlock ? AccountStatus.Active : AccountStatus.Blocked;
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
