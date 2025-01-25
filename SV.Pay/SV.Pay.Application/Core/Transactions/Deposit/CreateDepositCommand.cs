using SV.Pay.Application.Core.Transactions.Create;

namespace SV.Pay.Application.Core.Transactions.Deposit;

public sealed record CreateDepositCommand(
    Guid AccountId,
    decimal Amount,
    string Description,
    DateTime Date)
    : CreateTransactionCommand(AccountId, Amount, Description, Date);
