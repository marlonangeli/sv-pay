using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Accounts.Inactive;

public sealed record InactiveAccountCommand(Guid AccountId, bool Active = false) : ICommand;
