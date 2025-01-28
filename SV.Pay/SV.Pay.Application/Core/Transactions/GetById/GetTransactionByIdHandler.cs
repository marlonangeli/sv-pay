using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Transactions;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions.GetById;

internal sealed class GetTransactionByIdHandler(IPaymentsDbContext context)
    : IQueryHandler<GetTransactionByIdQuery, Transaction>
{
    public async Task<Result<Transaction>> Handle(GetTransactionByIdQuery request, CancellationToken cancellationToken)
    {
        var transaction = await context.Transactions
            .AsNoTracking()
            .Where(t => t.Id == request.TransactionId)
            .FirstOrDefaultAsync(cancellationToken);

        return transaction ?? Result.Failure<Transaction>(TransactionErrors.NotFound(request.TransactionId));
    }
}
