using Microsoft.EntityFrameworkCore;
using SV.Pay.Application.Abstractions.Data;
using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Transactions;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions.GetAllByPeriod;

internal sealed class GetAllTransactionsByPeriodHandler(IPaymentsDbContext context)
    : IQueryHandler<GetAllTransactionsByPeriodQuery, Pagination<Transaction>>
{
    public async Task<Result<Pagination<Transaction>>> Handle(GetAllTransactionsByPeriodQuery request,
        CancellationToken cancellationToken)
    {
        int totalItems = await context.Transactions
            .Where(t =>
                t.AccountId == request.AccountId &&
                t.Date >= request.StartDate &&
                t.Date <= request.EndDate)
            .CountAsync(cancellationToken);

        var transactions = await context.Transactions
            .AsNoTracking()
            .Where(t =>
                t.AccountId == request.AccountId &&
                t.Date >= request.StartDate &&
                t.Date <= request.EndDate)
            .OrderByDescending(t => t.Date)
            .Skip(request.PageSize * (request.Page - 1))
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new Pagination<Transaction>(
            transactions,
            totalItems,
            request.Page,
            request.PageSize);
    }
}
