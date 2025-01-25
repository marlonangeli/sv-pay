using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Accounts.ChangeLimit;

public sealed record ChangeDailyLimitCommand(Guid AccountId, decimal DailyLimit) : ICommand;
