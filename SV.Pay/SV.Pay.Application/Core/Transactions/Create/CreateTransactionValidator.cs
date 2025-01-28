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
            .IsValidMoney();

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithError(TransactionErrors.DescriptionIsRequired);

        RuleFor(x => x.Date)
            .NotEmpty()
            .GreaterThan(DateTime.Today.AddYears(-5))
            .LessThan(DateTime.Today.AddYears(1))
            .WithError(TransactionErrors.InvalidDate);
    }
}
