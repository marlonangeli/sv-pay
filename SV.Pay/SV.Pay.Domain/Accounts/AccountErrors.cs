using SV.Pay.Shared;

namespace SV.Pay.Domain.Accounts;

public static class AccountErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Accounts.NotFound",
        "The account was not found");

    public static readonly Error AccountIsBlocked = Error.Failure(
        "Accounts.AccountIsBlocked",
        "The account is blocked");

    public static readonly Error AccountIsInactive = Error.Failure(
        "Accounts.AccountIsInactive",
        "The account is inactive");

    public static readonly Error AccountTypeIsInvalid = Error.Problem(
        "Accounts.AccountTypeIsInvalid",
        "The account type is invalid");

    public static readonly Error AccountHasNoEnoughBalance = Error.Failure(
        "Accounts.AccountHasNoEnoughBalance",
        "The account has no enough balance");

    public static readonly Error AccountHasNoEnoughLimit = Error.Failure(
        "Accounts.AccountHasNoEnoughLimit",
        "The account has no enough limit");
}
