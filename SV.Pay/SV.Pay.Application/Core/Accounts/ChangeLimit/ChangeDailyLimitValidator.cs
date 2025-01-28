using FluentValidation;
using SV.Pay.Application.Core.Shared;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.ChangeLimit;

public class ChangeDailyLimitValidator : AbstractValidator<ChangeDailyLimitCommand>
{
    public ChangeDailyLimitValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.DailyLimit)
            .IsValidMoney(allowZero: false, AccountErrors.AccountDailyLimitIsInvalid);
    }
}
