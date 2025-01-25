using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Application.Core.Shared;
using SV.Pay.Domain.Transactions;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Transactions.GetAllByPeriod;

public record GetAllTransactionsByPeriodQuery(
    Guid AccountId,
    DateTime StartDate,
    DateTime EndDate,
    int Page,
    int PageSize = 100)
    : PaginationQuery(Page, PageSize), IQuery<Pagination<Transaction>>;
