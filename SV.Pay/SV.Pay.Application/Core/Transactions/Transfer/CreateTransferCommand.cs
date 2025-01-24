using SV.Pay.Application.Core.Transactions.Shared;

namespace SV.Pay.Application.Core.Transactions.Transfer;

public sealed record CreateTransferCommand(
    Guid AccountId,
    decimal Amount,
    string Description,
    DateTime Date,
    Guid RelatedAccountId)
    : CreateTransactionCommand(AccountId, Amount, Description, Date);
