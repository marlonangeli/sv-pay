using FluentValidation;
using SV.Pay.Application.Core.Transactions.Shared;

namespace SV.Pay.Application.Core.Transactions.Transfer;

public sealed class CreateTransferValidator : AbstractValidator<CreateTransferCommand>
{
    public CreateTransferValidator()
    {
        Include(new CreateTransactionValidator());

        RuleFor(x => x.RelatedAccountId)
            .NotEmpty();
    }
}
