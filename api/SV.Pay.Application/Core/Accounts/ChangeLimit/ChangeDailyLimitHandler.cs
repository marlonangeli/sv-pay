using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.ChangeLimit;

internal sealed class ChangeDailyLimitHandler(IPaymentsDbContext context) : ICommandHandler<ChangeDailyLimitCommand>
{
    public async Task<Result> Handle(ChangeDailyLimitCommand request, CancellationToken cancellationToken)
    {
        var account = await context.Accounts
            .Where(a => a.Id == request.AccountId)
            .FirstOrDefaultAsync(cancellationToken);

        switch (account)
        {
            case null:
                return Result.Failure(AccountErrors.NotFound);
            case { Status: AccountStatus.Blocked }:
                return Result.Failure(AccountErrors.AccountIsBlocked);
            case { Status: AccountStatus.Inactive }:
                return Result.Failure(AccountErrors.AccountIsInactive);
        }

        account.DailyLimit = new Money(request.DailyLimit);

        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
