using MediatR;
using SV.Pay.Api.Extensions;
using SV.Pay.Api.Utils;
using SV.Pay.Application.Core.Transactions;
using SV.Pay.Application.Core.Transactions.Deposit;
using SV.Pay.Application.Core.Transactions.Transfer;
using SV.Pay.Application.Core.Transactions.Withdraw;
using SV.Pay.Domain.Transactions;
using SV.Pay.Shared;

namespace SV.Pay.Api.Endpoints.Transactions;

internal sealed class TransactionsEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/transactions").WithTags(Tags.Transactions);

        group.MapPost("/deposit", async (CreateDepositCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Deposit money to account")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapPost("/withdraw", async (CreateWithdrawCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Withdraw money from account")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapPost("/transfer", async (CreateTransferCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Transfer money between accounts")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapGet("/{accountId:guid}", async (Guid accountId, ISender sender, CancellationToken ct) =>
            {
                Result<IEnumerable<Transaction>> result = await sender.Send(new GetTransactionsQuery(accountId), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get transactions for account")
            .Produces<IEnumerable<Transaction>>()
            .ProducesValidationProblem();
    }
}
