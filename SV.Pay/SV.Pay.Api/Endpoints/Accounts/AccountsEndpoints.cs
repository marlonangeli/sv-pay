using MediatR;
using SV.Pay.Api.Extensions;
using SV.Pay.Api.Utils;
using SV.Pay.Application.Core.Accounts.Block;
using SV.Pay.Application.Core.Accounts.Create;
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
                Result result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Create a new account")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapGet("/{accountId:guid}", async (Guid accountId, ISender sender, CancellationToken ct) =>
            {
                Result<Account> result = await sender.Send(new GetAccountByIdQuery(accountId), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get account by id")
            .Produces<Account>()
            .ProducesValidationProblem();

        group.MapPut("/block", async (BlockAccountCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithDescription("Block or unblock an account")
            .ProducesValidationProblem();

        group.MapPut("/inactive", async (InactiveAccountCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(new InactiveAccountCommand(command.AccountId), ct);

                return result.Match(Results.NoContent, CustomResults.Problem);
            })
            .WithDescription("Inactive an account")
            .ProducesValidationProblem();
    }
}
