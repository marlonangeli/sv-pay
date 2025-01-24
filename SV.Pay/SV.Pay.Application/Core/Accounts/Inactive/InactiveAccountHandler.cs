using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.Inactive;

internal sealed class InactiveAccountHandler(IPaymentsDbContext context) : ICommandHandler<InactiveAccountCommand>
{
    public async Task<Result> Handle(InactiveAccountCommand request, CancellationToken cancellationToken)
    {
        Account? account = await context.Accounts
            .Where(a => a.Id == request.AccountId)
            .FirstOrDefaultAsync(cancellationToken);

        switch (account)
        {
            case null:
                return Result.Failure(AccountErrors.NotFound);
            case { Status: AccountStatus.Blocked }:
                return Result.Failure(AccountErrors.AccountIsBlocked);
            case { Status: AccountStatus.Inactive } when !request.Active:
                return Result.Failure(AccountErrors.AccountIsInactive);
        }

        account.Status = request.Active ? AccountStatus.Active : AccountStatus.Inactive;
        await context.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
