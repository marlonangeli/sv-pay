using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Accounts.GetById;

internal sealed class GetAccountByIdHandler(IPaymentsDbContext context) : IQueryHandler<GetAccountByIdQuery, Account>
{
    public async Task<Result<Account>> Handle(GetAccountByIdQuery request, CancellationToken cancellationToken)
    {
        var account = await context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == request.AccountId, cancellationToken);

        if (account is null)
            return Result.Failure<Account>(AccountErrors.NotFound);

        return account;
    }
}
