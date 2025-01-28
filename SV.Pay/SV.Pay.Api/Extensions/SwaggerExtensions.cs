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

    /// <summary>
    /// Extension method that produces BadRequest, NotFound, Conflict and InternalServerError
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    public static RouteHandlerBuilder ProducesErrors(this RouteHandlerBuilder builder) =>
        builder
            .ProducesValidationProblem()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status409Conflict)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
}
