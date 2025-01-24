using FluentValidation;

namespace SV.Pay.Application.Core.Accounts.Block;

public sealed class BlockAccountValidator : AbstractValidator<BlockAccountCommand>
{
    public BlockAccountValidator()
    {
        RuleFor(x => x.AccountId)
            .NotEmpty();
    }
}
