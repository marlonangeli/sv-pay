using FluentValidation;

namespace SV.Pay.Application.Core.Transactions.Create;

public sealed class CreateTransactionValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.Amount)
            .NotEmpty()
            .GreaterThan(0);

        RuleFor(x => x.Description)
            .NotEmpty();

        RuleFor(x => x.Date)
            .NotEmpty();
    }
}
