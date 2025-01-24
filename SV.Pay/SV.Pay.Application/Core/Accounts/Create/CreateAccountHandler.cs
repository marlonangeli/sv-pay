using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.Create;

internal sealed class CreateAccountHandler(IPaymentsDbContext context) : ICommandHandler<CreateAccountCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateAccountCommand request, CancellationToken cancellationToken)
    {
        bool userExists = await context.Users.AnyAsync(u => u.Id == request.UserId, cancellationToken);
        if (!userExists)
            return Result.Failure<Guid>(AccountErrors.UserNotFound);

        Account account = new()
        {
            UserId = request.UserId,
            DailyLimit = new Money(request.DailyLimit),
            Balance = new Money(request.InitialBalance),
            Name = request.Name,
            Status = AccountStatus.Active,
            Type = request.Type
        };

        context.Accounts.Add(account);
        await context.SaveChangesAsync(cancellationToken);

        return account.Id;
    }
}
