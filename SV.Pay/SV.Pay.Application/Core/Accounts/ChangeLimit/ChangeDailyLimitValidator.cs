using FluentValidation;

namespace SV.Pay.Application.Core.Accounts.ChangeLimit;

public class ChangeDailyLimitValidator : AbstractValidator<ChangeDailyLimitCommand>
{
    public ChangeDailyLimitValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.DailyLimit)
            .NotEmpty()
            .GreaterThan(0);
    }
}
