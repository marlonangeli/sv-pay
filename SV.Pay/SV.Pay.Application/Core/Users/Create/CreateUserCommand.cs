using SV.Pay.Application.Abstractions.Messaging;

namespace SV.Pay.Application.Core.Users.Create;

public sealed record CreateUserCommand(
    string FirstName,
    string LastName,
    string Email,
    DateTime DateOfBirth,
    string CPF
) : ICommand<Guid>;
