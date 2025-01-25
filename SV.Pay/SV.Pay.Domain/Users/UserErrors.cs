using SV.Pay.Shared;

namespace SV.Pay.Domain.Users;

public static class UserErrors
{
    public static readonly Error NameIsRequired = Error.Problem(
        "Users.NameIsRequired",
        "The name is required");

    public static  Error NotFoundByEmail(string email) => Error.NotFound(
        "Users.NotFoundByEmail",
        $"The user with the email '{email}' was not found");

    public static readonly Error EmailNotUnique = Error.Conflict(
        "Users.EmailNotUnique",
        "The provided email is not unique");

    public static readonly Error InvalidEmail = Error.Problem(
        "Users.InvalidEmail",
        "Email provided was invalid");

    public static Error NotFound(Guid userId) => Error.NotFound(
        "Users.NotFound",
        $"The user with the Id = '{userId}' was not found");

    public static readonly Error InvalidCPF = Error.Problem(
        "Users.InvalidCPF",
        "CPF provided was invalid");

    public static readonly Error CPFNotUnique = Error.Conflict(
        "Users.CPFNotUnique",
        "The provided CPF is not unique");

    public static Error CPFNotFound(string cpf) => Error.NotFound(
        "Users.CPFNotFound",
        $"The user with the CPF '{cpf}' was not found");

    public static readonly Error InvalidBirthDate = Error.Problem(
        "Users.InvalidBirthDate",
        "The birth date is invalid");
}
