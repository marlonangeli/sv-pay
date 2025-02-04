using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.GetById;

public sealed record GetAccountByIdQuery(Guid AccountId) : IQuery<Account>;
