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

    public static readonly Error AccountIsBlocked = Error.Failure(
        "Transactions.AccountIsBlocked",
        "The account in transaction is blocked");

    public static readonly Error NotEnoughBalance = Error.Failure(
        "Transactions.NotEnoughBalance",
        "The account has no enough balance");

    public static readonly Error NotEnoughLimit = Error.Failure(
        "Transactions.NotEnoughLimit",
        "The account has no enough limit");
}
