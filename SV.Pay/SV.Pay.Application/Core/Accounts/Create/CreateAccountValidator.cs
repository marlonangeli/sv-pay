using FluentValidation;
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
            .NotNull()
            .WithError(AccountErrors.AccountInitialBalanceIsInvalid)
            .GreaterThanOrEqualTo(0)
            .WithError(AccountErrors.AccountInitialBalanceIsInvalid);

        RuleFor(x => x.DailyLimit)
            .NotEmpty()
            .WithError(AccountErrors.AccountDailyLimitIsInvalid)
            .GreaterThan(0)
            .WithError(AccountErrors.AccountDailyLimitIsInvalid);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(32)
            .WithError(AccountErrors.AccountNameIsInvalid);
    }
}
