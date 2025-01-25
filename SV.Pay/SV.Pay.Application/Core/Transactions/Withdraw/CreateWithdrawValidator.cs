using FluentValidation;
using SV.Pay.Application.Core.Transactions.Create;

namespace SV.Pay.Application.Core.Transactions.Withdraw;

public sealed class CreateWithdrawValidator : AbstractValidator<CreateWithdrawCommand>
{
    public CreateWithdrawValidator()
    {
        Include(new CreateTransactionValidator());
    }
}
