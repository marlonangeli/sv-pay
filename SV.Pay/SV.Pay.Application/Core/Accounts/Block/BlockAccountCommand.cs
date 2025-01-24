using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Accounts.Block;

public sealed record BlockAccountCommand(Guid AccountId, bool Unlock = false) : ICommand;
