using FluentValidation;

namespace SV.Pay.Application.Core.Accounts.GetById;

public sealed class GetAccountByIdValidator : AbstractValidator<GetAccountByIdQuery>
{
    public GetAccountByIdValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();
    }
}
