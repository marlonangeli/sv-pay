using FluentValidation;
using SV.Pay.Application.Core.Transactions.Create;

namespace SV.Pay.Application.Core.Transactions.Deposit;

public class CreateDepositValidator : AbstractValidator<CreateDepositCommand>
{
    public CreateDepositValidator()
    {
        Include(new CreateTransactionValidator());
    }
}
