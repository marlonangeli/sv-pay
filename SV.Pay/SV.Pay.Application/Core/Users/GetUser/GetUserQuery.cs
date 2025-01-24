using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.GetUser;

public sealed record GetUserByEmailQuery(string Email) : IQuery<User>;

public sealed record GetUserByCPFQuery(string CPF) : IQuery<User>;
