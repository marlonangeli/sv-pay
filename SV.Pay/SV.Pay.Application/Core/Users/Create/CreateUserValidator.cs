using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Core.Users.Create;

public sealed class CreateUserValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithError(UserErrors.NameIsRequired)
            .MaximumLength(50)
            .WithError(UserErrors.NameIsRequired);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithError(UserErrors.NameIsRequired)
            .MaximumLength(50)
            .WithError(UserErrors.NameIsRequired);

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithError(UserErrors.InvalidEmail);

        RuleFor(x => x.DateOfBirth)
            .NotEmpty()
            .GreaterThan(DateTime.Today.AddYears(-150))
            .WithError(UserErrors.InvalidBirthDate)
            .LessThan(DateTime.Today)
            .WithError(UserErrors.InvalidBirthDate);

        RuleFor(x => x.CPF)
            .Must(CPF.IsValid)
            .WithError(UserErrors.InvalidCPF);
    }
}
