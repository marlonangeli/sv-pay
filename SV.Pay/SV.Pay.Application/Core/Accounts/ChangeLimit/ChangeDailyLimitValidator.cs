using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.ChangeLimit;

public class ChangeDailyLimitValidator : AbstractValidator<ChangeDailyLimitCommand>
{
    public ChangeDailyLimitValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.DailyLimit)
            .NotEmpty()
            .WithError(AccountErrors.AccountDailyLimitIsInvalid)
            .GreaterThan(0)
            .WithError(AccountErrors.AccountDailyLimitIsInvalid);
    }
}
