using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Transactions;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions;

public sealed record GetTransactionsQuery(Guid AccountId) : IQuery<IEnumerable<Transaction>>;

internal sealed class GetTransactions(IPaymentsDbContext context) : IQueryHandler<GetTransactionsQuery, IEnumerable<Transaction>>
{
    public async Task<Result<IEnumerable<Transaction>>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var transactions = await context.Transactions
            .Where(t => t.AccountId == request.AccountId)
            .ToListAsync(cancellationToken);

        return transactions;
    }
}
