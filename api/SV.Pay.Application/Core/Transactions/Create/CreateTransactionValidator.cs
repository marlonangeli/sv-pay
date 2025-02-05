using FluentValidation;
using SV.Pay.Application.Core.Shared;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Transactions;

namespace SV.Pay.Application.Core.Transactions.Create;

public sealed class CreateTransactionValidator : AbstractValidator<CreateTransactionCommand>
{
    public CreateTransactionValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.Amount)
            .IsValidMoney(allowZero: false, TransactionErrors.NegativeAmount);

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithError(TransactionErrors.DescriptionIsRequired);

        RuleFor(x => x.Date)
            .NotEmpty()
            .GreaterThan(DateTime.UtcNow.AddYears(-5))
            .WithError(TransactionErrors.InvalidDate)
            .LessThan(DateTime.UtcNow.AddYears(1))
            .WithError(TransactionErrors.InvalidDate);
    }
}
