using FluentValidation;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain;

namespace SV.Pay.Application.Core.Shared;

public sealed class PaginationQueryValidator : AbstractValidator<PaginationQuery>
{
    public PaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithError(GlobalSharedErrors.InvalidPageNumber);

        RuleFor(x => x.PageSize)
            .GreaterThanOrEqualTo(1)
            .WithError(GlobalSharedErrors.InvalidPageSize)
            .LessThanOrEqualTo(100)
            .WithError(GlobalSharedErrors.InvalidPageSize);
    }
}
