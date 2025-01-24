using FluentValidation;
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
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.DailyLimit)
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(32);
    }
}
