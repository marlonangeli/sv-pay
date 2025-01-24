using MediatR;
using SV.Pay.Api.Extensions;
using SV.Pay.Api.Utils;
using SV.Pay.Application.Core.Users.Create;
using SV.Pay.Application.Core.Users.GetUser;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Api.Endpoints.Users;

internal sealed class UsersEndpoints : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/users").WithTags(Tags.Users);

        group.MapPost("/", async (
                CreateUserCommand command, ISender sender, CancellationToken ct) =>
            {
                Result result = await sender.Send(command, ct);

                return result.Match(Results.Created, CustomResults.Problem);
            })
            .WithDescription("Create a new user")
            .Produces<Guid>()
            .ProducesValidationProblem();

        group.MapPost("/search", async (
                GetUserByEmailOrCPFRequest request, ISender sender, CancellationToken ct) =>
            {
                Result<User> result;

                if (request.Type == GetUserRequestType.Email)
                    result = await sender.Send(new GetUserByEmailQuery(request.Value), ct);
                else
                    result = await sender.Send(new GetUserByCPFQuery(request.Value), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get user by email or CPF")
            .Produces<User>()
            .ProducesValidationProblem();
    }
}
