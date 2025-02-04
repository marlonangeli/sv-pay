using SV.Pay.Shared;

namespace SV.Pay.Domain.Types;

public static class MoneyErrors
{
    public static readonly Error MoneyIsRequired = Error.Problem(
        "Money.AmountIsRequired",
        "The amount is required");

    public static readonly Error MoneyIsInvalid = Error.Problem(
        "Money.AmountIsInvalid",
        "The amount is invalid");

    public static readonly Error MoneyIsNegative = Error.Problem(
        "Money.AmountIsNegative",
        "The amount must be greater than or equal to 0");

    public static readonly Error MoneyPrecisionIsInvalid = Error.Problem(
        "Money.AmountPrecisionIsInvalid",
        "The amount must have up to 2 decimal places");
}
