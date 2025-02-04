using FluentValidation;
using SV.Pay.Application.Core.Transactions.Create;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Transactions;

namespace SV.Pay.Application.Core.Transactions.Transfer;

public sealed class CreateTransferValidator : AbstractValidator<CreateTransferCommand>
{
    public CreateTransferValidator()
    {
        Include(new CreateTransactionValidator());

        RuleFor(x => x.RelatedAccountId)
            .NotEmpty();

        // AccountId and RelatedAccount cant be the same
        RuleFor(x => x.RelatedAccountId)
            .NotEqual(x => x.AccountId)
            .WithError(TransactionErrors.AccountIdAndRelatedAccountIdCantBeTheSame);
    }
}
