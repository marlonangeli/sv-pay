using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.Create;

public sealed record CreateAccountCommand(
    Guid UserId,
    string Name,
    AccountType Type,
    decimal InitialBalance,
    decimal DailyLimit
) : ICommand<Guid>;
