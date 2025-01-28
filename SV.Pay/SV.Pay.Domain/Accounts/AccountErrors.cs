using SV.Pay.Shared;

namespace SV.Pay.Domain.Accounts;

public static class AccountErrors
{
    public static readonly Error NotFound = Error.NotFound(
        "Accounts.NotFound",
        "The account was not found");

    public static readonly Error UserNotFound = Error.NotFound(
        "Accounts.UserNotFound",
        "The user was not found");

    public static readonly Error AccountNameIsInvalid = Error.Problem(
        "Accounts.AccountNameIsInvalid",
        "The account name is invalid");

    public static readonly Error AccountIsBlocked = Error.Problem(
        "Accounts.AccountIsBlocked",
        "The account is blocked");

    public static readonly Error AccountIsInactive = Error.Problem(
        "Accounts.AccountIsInactive",
        "The account is inactive");

    public static readonly Error AccountInitialBalanceIsInvalid = Error.Problem(
        "Accounts.AccountInitialBalanceIsInvalid",
        "The account initial balance is invalid. It must be greater than or equal to zero");

    public static readonly Error AccountTypeIsInvalid = Error.Problem(
        "Accounts.AccountTypeIsInvalid",
        "The account type is invalid");

    public static readonly Error AccountHasNoEnoughBalance = Error.Problem(
        "Accounts.AccountHasNoEnoughBalance",
        "The account has no enough balance");

    public static readonly Error AccountHasNoEnoughLimit = Error.Problem(
        "Accounts.AccountHasNoEnoughLimit",
        "The account has no enough limit");

    public static readonly Error AccountDailyLimitIsInvalid = Error.Problem(
        "Accounts.AccountDailyLimitIsInvalid",
        "The account daily limit is invalid");

    public static readonly Error AccountExtractRequestIsInvalid = Error.Problem(
        "Accounts.AccountExtractRequestIsInvalid",
        "The account extract request is invalid");
}
