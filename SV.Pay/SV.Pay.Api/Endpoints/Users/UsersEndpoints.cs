using MediatR;
using SV.Pay.Api.Extensions;
using SV.Pay.Application.Core.Users.Create;
using SV.Pay.Application.Core.Users.GetById;
using SV.Pay.Application.Core.Users.SearchUser;
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
                Result<Guid> result = await sender.Send(command, ct);

                return result.Match(userId => Results.Created($"/api/v1/users/{userId}", userId),
                    CustomResults.Problem);
            })
            .WithDescription("Create a new user")
            .Produces<Guid>(StatusCodes.Status201Created)
            .ProducesBadRequest()
            .ProducesConflict()
            .ProducesInternalServerError();

        group.MapPost("/search", async (
                GetUserByEmailOrCPFRequest request, ISender sender, CancellationToken ct) =>
            {
                Result<User> result;

                switch (request.Type)
                {
                    case GetUserRequestType.Email:
                        result = await sender.Send(new SearchUserByEmailQuery(request.Value), ct);
                        break;
                    case GetUserRequestType.CPF:
                        result = await sender.Send(new SearchUserByCPFQuery(request.Value), ct);
                        break;
                    default:
                        return Results.BadRequest(Error.Problem("RequestType.Invalid", "Invalid request type"));
                }

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get user by email or CPF")
            .Produces<User>()
            .ProducesBadRequest()
            .ProducesNotFound()
            .ProducesInternalServerError();

        group.MapGet("/{userId}", async (
                Guid userId, ISender sender, CancellationToken ct) =>
            {
                Result<User> result = await sender.Send(new GetUserByIdQuery(userId), ct);

                return result.Match(Results.Ok, CustomResults.Problem);
            })
            .WithDescription("Get user by ID")
            .Produces<User>()
            .ProducesBadRequest()
            .ProducesNotFound()
            .ProducesInternalServerError();
    }
}

public record GetUserByEmailOrCPFRequest(GetUserRequestType Type, string Value);

public enum GetUserRequestType
{
    Email,
    CPF
}
