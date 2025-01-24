using FluentValidation;

namespace SV.Pay.Application.Core.Accounts.Inactive;

public sealed class InactiveAccountValidator : AbstractValidator<InactiveAccountCommand>
{
    public InactiveAccountValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();
    }
}
