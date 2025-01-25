using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.SearchUser;

public sealed class SearchUserByEmailValidator : AbstractValidator<SearchUserByEmailQuery>
{
    public SearchUserByEmailValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .WithError(UserErrors.InvalidEmail);
    }
}

public sealed class SearchUserByCPFValidator : AbstractValidator<SearchUserByCPFQuery>
{
    public SearchUserByCPFValidator()
    {
        RuleFor(x => x.CPF)
            .NotEmpty()
            .Must(CPF.IsValid)
            .WithError(UserErrors.InvalidCPF);
    }
}
