using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Transactions.Shared;

public record CreateTransactionCommand(
    Guid AccountId,
    decimal Amount,
    string Description,
    DateTime Date
) : ICommand<Guid>;
