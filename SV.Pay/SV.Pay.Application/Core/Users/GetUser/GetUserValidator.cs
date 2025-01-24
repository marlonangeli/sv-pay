using FluentValidation;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.GetUser;

public sealed class GetUserByEmailValidator : AbstractValidator<GetUserByEmailQuery>
{
    public GetUserByEmailValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}

public sealed class GetUserByCPFValidator : AbstractValidator<GetUserByCPFQuery>
{
    public GetUserByCPFValidator()
    {
        RuleFor(x => x.CPF)
            .NotEmpty()
            .Must(CPF.IsValid).WithMessage(UserErrors.InvalidCPF.Description);
    }
}
