using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Application.Core.Accounts.Extract;

public sealed class GetMonthlyAccountExtractValidator : AbstractValidator<GetMonthlyAccountExtractQuery>
{
    public GetMonthlyAccountExtractValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12)
            .WithError(AccountErrors.AccountExtractRequestIsInvalid);

        RuleFor(x => x.Year)
            .InclusiveBetween(DateTime.Today.Year - 10, DateTime.Today.Year + 1)
            .WithError(AccountErrors.AccountExtractRequestIsInvalid);
    }
}
