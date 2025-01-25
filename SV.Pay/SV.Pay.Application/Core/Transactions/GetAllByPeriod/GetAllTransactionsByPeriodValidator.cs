using FluentValidation;
using SV.Pay.Application.Core.Shared;
using SV.Pay.Application.Extensions;
using SV.Pay.Domain.Transactions;

namespace SV.Pay.Application.Core.Transactions.GetAllByPeriod;

public sealed class GetAllTransactionsByPeriodValidator : AbstractValidator<GetAllTransactionsByPeriodQuery>
{
    public GetAllTransactionsByPeriodValidator()
    {
        Include(new PaginationQueryValidator());

        RuleFor(x => x.StartDate)
            .NotEmpty()
            .LessThanOrEqualTo(x => x.EndDate)
            .WithError(TransactionErrors.InvalidPeriodDate);

        RuleFor(x => x.EndDate)
            .NotEmpty()
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithError(TransactionErrors.InvalidPeriodDate);

        RuleFor(x => x.EndDate.Subtract(x.StartDate).TotalDays)
            .LessThanOrEqualTo(365)
            .WithError(TransactionErrors.InvalidPeriodInterval);
    }
}
