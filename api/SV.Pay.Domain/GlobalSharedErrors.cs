using SV.Pay.Shared;

namespace SV.Pay.Domain;

public static class GlobalSharedErrors
{
    public static readonly Error InvalidPageNumber = Error.Problem(
        "InvalidPageNumber",
        "Invalid page number. It must be greater than 0.");

    public static readonly Error InvalidPageSize = Error.Problem(
        "InvalidPageSize",
        "Invalid page size. It must be between 1 and 100.");

    public static readonly Error InvalidRequestType = Error.Problem(
        "InvalidRequestType",
        "Invalid request type.");
}
