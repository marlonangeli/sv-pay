using SV.Pay.Shared;

namespace SV.Pay.Domain.Transactions;

public static class TransactionErrors
{
    public static readonly Error NegativeAmount = Error.Problem(
        "Transactions.NegativeAmount",
        "The amount must be greater than zero");

    public static readonly Error InvalidTransactionType = Error.Problem(
        "Transactions.InvalidTransactionType",
        "The transaction type is invalid");

    public static readonly Error NotFound = Error.NotFound(
        "Transactions.NotFound",
        "The transaction was not found");

    public static readonly Error AccountNotFound = Error.NotFound(
        "Transactions.AccountNotFound",
        "The account in transaction was not found");

    public static readonly Error AccountIsBlocked = Error.Problem(
        "Transactions.AccountIsBlocked",
        "The account in transaction is blocked");

    public static readonly Error AccountIsInactive = Error.Problem(
        "Transactions.AccountIsInactive",
        "The account in transaction is inactive");

    public static readonly Error NotEnoughBalance = Error.Problem(
        "Transactions.NotEnoughBalance",
        "The account has no enough balance");

    public static readonly Error NotEnoughLimit = Error.Problem(
        "Transactions.NotEnoughLimit",
        "The account has no enough limit");

    public static readonly Error ConcurrencyError = Error.Conflict(
        "Transactions.ConcurrencyError",
        "A concurrency error occurred while saving the transaction");
}
