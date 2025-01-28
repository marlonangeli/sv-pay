using FluentValidation;
using SV.Pay.Application.Core.Shared;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.Create;

public sealed class CreateAccountValidator : AbstractValidator<CreateAccountCommand>
{
    public CreateAccountValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.Type)
            .IsInEnum();

        RuleFor(x => x.InitialBalance)
            .IsValidMoney(allowZero: true, AccountErrors.AccountInitialBalanceIsInvalid);

        RuleFor(x => x.DailyLimit)
            .IsValidMoney(allowZero: false, AccountErrors.AccountDailyLimitIsInvalid);

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithError(AccountErrors.AccountNameIsInvalid)
            .MaximumLength(32)
            .WithError(AccountErrors.AccountNameIsInvalid);
    }
}
