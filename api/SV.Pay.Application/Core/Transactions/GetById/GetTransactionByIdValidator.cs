using FluentValidation;

namespace SV.Pay.Application.Core.Transactions.GetById;

public sealed class GetTransactionByIdValidator : AbstractValidator<GetTransactionByIdQuery>
{
    public GetTransactionByIdValidator()
    {
        RuleFor(x => x.TransactionId)
            .NotEmpty();
    }
}
