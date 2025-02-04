using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.GetById;

public sealed record GetUserByIdQuery(Guid UserId) : IQuery<User>;
