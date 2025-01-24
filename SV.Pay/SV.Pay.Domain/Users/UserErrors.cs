using SV.Pay.Shared;

namespace SV.Pay.Domain.Users;

public static class UserErrors
{
    public static readonly Error NotFoundByEmail = Error.NotFound(
        "Users.NotFoundByEmail",
        "The user with the specified email was not found");

    public static readonly Error EmailNotUnique = Error.Conflict(
        "Users.EmailNotUnique",
        "The provided email is not unique");

    public static Error NotFound(Guid userId) => Error.NotFound(
        "Users.NotFound",
        $"The user with the Id = '{userId}' was not found");

    public static readonly Error InvalidCPF = Error.Problem(
        "Users.InvalidCPF",
        "CPF provided was invalid");

    public static readonly Error CPFNotUnique = Error.Conflict(
        "Users.CPFNotUnique",
        "The provided CPF is not unique");

    public static readonly Error CPFNotFound = Error.NotFound(
        "Users.CPFNotFound",
        "The user with the specified CPF was not found");
}
