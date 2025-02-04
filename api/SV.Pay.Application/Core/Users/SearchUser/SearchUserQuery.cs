using SV.Pay.Application.Abstractions.Messaging;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.SearchUser;

public sealed record SearchUserByEmailQuery(string Email) : IQuery<User>;

public sealed record SearchUserByCPFQuery(string CPF) : IQuery<User>;
