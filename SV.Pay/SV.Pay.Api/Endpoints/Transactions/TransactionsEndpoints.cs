﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using SV.Pay.Api.Extensions;
using SV.Pay.Api.Utils;
using SV.Pay.Application.Core.Transactions;
using SV.Pay.Application.Core.Transactions.Deposit;
using SV.Pay.Application.Core.Transactions.GetAllByPeriod;
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
                Result<Guid> result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Deposit money to account")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapPost("/withdraw", async (CreateWithdrawCommand command, ISender sender, CancellationToken ct) =>
            {
                Result<Guid> result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Withdraw money from account")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapPost("/transfer", async (CreateTransferCommand command, ISender sender, CancellationToken ct) =>
            {
                Result<Guid> result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Transfer money between accounts")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapGet("/{accountId:guid}",
                async (ISender sender,
                    CancellationToken ct,
                    Guid accountId,
                    [FromQuery] DateTime startDate,
                    [FromQuery] DateTime endDate,
                    [FromQuery] int page = 1,
                    [FromQuery] int pageSize = 100) =>
                {
                    Result<Pagination<Transaction>>
                        result = await sender.Send(
                            new GetAllTransactionsByPeriodQuery(accountId, startDate, endDate, page, pageSize), ct);

                    return result.Match(Results.Ok, CustomResults.Problem);
                })
            .WithDescription("Get transactions for account")
            .Produces<Pagination<Transaction>>()
            .ProducesValidationProblem();
    }
}
