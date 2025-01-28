using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Application.Core.Shared;

public static class MoneyValidations
{

    public static IRuleBuilderOptions<T, Money> IsValidMoney<T>(
        this IRuleBuilder<T, Money> ruleBuilder,
        bool allowZero = false,
        Error? customError = null)
    {
        return ruleBuilder
            .NotNull()
            .WithError(customError ?? MoneyErrors.MoneyIsRequired)
            .Must(money => ValidateAmount(money.Amount, allowZero))
            .WithError(customError ?? MoneyErrors.MoneyIsNegative)
            .Must(money => ValidatePrecision(money.Amount))
            .WithError(customError ?? MoneyErrors.MoneyPrecisionIsInvalid);
    }

    public static IRuleBuilderOptions<T, decimal> IsValidMoney<T>(
        this IRuleBuilder<T, decimal> ruleBuilder,
        bool allowZero = false,
        Error? customError = null)
    {
        return ruleBuilder
            .NotNull()
            .WithError(customError ?? MoneyErrors.MoneyIsRequired)
            .Must(amount => ValidateAmount(amount, allowZero))
            .WithError(customError ?? MoneyErrors.MoneyIsNegative)
            .Must(amount => ValidatePrecision(amount))
            .WithError(customError ?? MoneyErrors.MoneyPrecisionIsInvalid);
    }

    private static bool ValidateAmount(decimal? amount, bool allowZero)
    {
        if (amount == null)
            return false;

        return allowZero ? amount >= 0 : amount > 0;
    }

    private static bool ValidatePrecision(decimal? amount)
    {
        if (amount == null)
            return false;

        return Math.Round(amount.Value, 2) == amount.Value;
    }
}
