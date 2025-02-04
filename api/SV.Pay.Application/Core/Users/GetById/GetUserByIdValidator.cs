using FluentValidation;

namespace SV.Pay.Application.Core.Users.GetById;

public sealed class GetUserByIdValidator : AbstractValidator<GetUserByIdQuery>
{
    public GetUserByIdValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();
    }
}
