﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using SV.Pay.Api.Extensions;
using SV.Pay.Application.Core.Accounts.Block;
using SV.Pay.Application.Core.Accounts.ChangeLimit;
using SV.Pay.Application.Core.Accounts.Create;
using SV.Pay.Application.Core.Accounts.Extract;
using SV.Pay.Application.Core.Accounts.GetById;
using SV.Pay.Application.Core.Accounts.Inactive;
using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Api.Endpoints.Accounts;

internal sealed class AccountsEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/accounts").WithTags(Tags.Accounts);

        group.MapPost("/", async (CreateAccountCommand command, ISender sender, CancellationToken ct) =>
            {
                Result<Guid> result = await sender.Send(command, ct);

                return result.Match(accountId => Results.Created($"/api/v1/accounts/{accountId}", accountId),
                    CustomResults.Problem);
            })
            .WithDescription("Create a new account")
            .WithName("CreateAccount")
            .Produces<Guid>(StatusCodes.Status201Created)
            .ProducesBadRequest()
            .ProducesConflict()
            .ProducesInternalServerError();

        group.MapPut("/block", async (BlockAccountCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .Produces(StatusCodes.Status204NoContent)
            .WithDescription("Block or unblock an account")
            .WithName("BlockAccount")
            .ProducesErrors();

        group.MapPut("/inactive", async (InactiveAccountCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .Produces(StatusCodes.Status204NoContent)
            .WithDescription("Inactive or active an account")
            .WithName("InactiveAccount")
            .ProducesErrors();

        group.MapPut("/limit", async (ChangeDailyLimitCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .Produces(StatusCodes.Status204NoContent)
            .WithDescription("Change daily limit of an account")
            .WithName("ChangeDailyLimit")
            .ProducesErrors();

        group.MapGet("/{accountId}", async (Guid accountId, ISender sender, CancellationToken ct) =>
            {
                Result<Account> result = await sender.Send(new GetAccountByIdQuery(accountId), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get account details by id")
            .WithName("GetAccountById")
            .Produces<Account>()
            .ProducesBadRequest()
            .ProducesNotFound()
            .ProducesInternalServerError();

        group.MapGet("/{accountId:guid}/extract", async (
                Guid accountId,
                [FromQuery] int year,
                [FromQuery] int month,
                ISender sender,
                CancellationToken ct) =>
            {
                Result<MonthlyAccountExtract> result =
                    await sender.Send(new GetMonthlyAccountExtractQuery(accountId, year, month), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get monthly extract of an account")
            .WithName("GetMonthlyAccountExtract")
            .Produces<MonthlyAccountExtract>()
            .ProducesErrors();
    }
}
