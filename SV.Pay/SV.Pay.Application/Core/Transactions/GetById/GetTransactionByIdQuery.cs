using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Transactions;

namespace SV.Pay.Application.Core.Transactions.GetById;

public sealed record GetTransactionByIdQuery(Guid TransactionId) : IQuery<Transaction>;
