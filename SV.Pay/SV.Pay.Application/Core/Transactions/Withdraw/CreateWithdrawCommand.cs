using SV.Pay.Application.Core.Transactions.Create;

namespace SV.Pay.Application.Core.Transactions.Withdraw;

public sealed record CreateWithdrawCommand(
    Guid AccountId,
    decimal Amount,
    string Description,
    DateTime Date)
    : CreateTransactionCommand(AccountId, Amount, Description, Date);
