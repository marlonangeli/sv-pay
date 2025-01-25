using FluentValidation;
using SV.Pay.Application.Core.Shared;

namespace SV.Pay.Application.Core.Transactions.GetAllByPeriod;

public sealed class GetAllTransactionsByPeriodValidator : AbstractValidator<GetAllTransactionsByPeriodQuery>
{
    public GetAllTransactionsByPeriodValidator()
    {
        Include(new PaginationQueryValidator());

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .LessThanOrEqualTo(x => x.EndDate)
            .WithMessage("Start date must be less than or equal to end date");

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("End date must be greater than or equal to start date");

        RuleFor(x => x.EndDate.Subtract(x.StartDate).TotalDays)
            .LessThanOrEqualTo(365)
            .WithMessage("The interval between dates must be less than 1 year");
    }
}
