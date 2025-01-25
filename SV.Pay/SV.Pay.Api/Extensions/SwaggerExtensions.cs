namespace SV.Pay.Api.Extensions;

public static class SwaggerExtensions
{
    public static RouteHandlerBuilder ProducesBadRequest(this RouteHandlerBuilder builder) =>
        builder
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest);

    public static RouteHandlerBuilder ProducesNotFound(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status404NotFound);

    public static RouteHandlerBuilder ProducesConflict(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status409Conflict);

    public static RouteHandlerBuilder ProducesInternalServerError(this RouteHandlerBuilder builder) =>
        builder
            .ProducesProblem(StatusCodes.Status500InternalServerError);

    public static RouteHandlerBuilder ProducesAllErrors(this RouteHandlerBuilder builder) =>
        builder
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
}
