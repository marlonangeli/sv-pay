using FluentValidation;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.Create;

public sealed class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.DateOfBirth)
            .NotEmpty()
            .GreaterThan(DateTime.Today.AddYears(-150)).WithMessage("Wow! You are too old!")
            .LessThan(DateTime.Today);

        RuleFor(x => x.CPF)
            .NotEmpty()
            .Must(CPF.IsValid).WithMessage(UserErrors.InvalidCPF.Description);
    }
}
