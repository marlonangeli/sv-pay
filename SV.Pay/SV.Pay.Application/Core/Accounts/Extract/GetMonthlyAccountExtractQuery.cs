using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Accounts.Extract;

public sealed record GetMonthlyAccountExtractQuery(
    Guid AccountId,
    int Year,
    int Month) : IQuery<MonthlyAccountExtract>;
