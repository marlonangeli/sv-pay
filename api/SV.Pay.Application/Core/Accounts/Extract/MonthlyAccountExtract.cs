using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;

namespace SV.Pay.Application.Core.Accounts.Extract;

public record MonthlyAccountExtract(
    Money InitialBalance,
    Money FinalBalance,
    Money TotalIncome,
    Money TotalOutcome,
    IReadOnlyList<Transaction> Transactions,
    DateTime StartDate,
    DateTime EndDate);
