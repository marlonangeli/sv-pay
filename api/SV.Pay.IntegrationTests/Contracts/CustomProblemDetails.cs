namespace SV.Pay.IntegrationTests.Contracts;

internal sealed class CustomProblemDetails
{
    public string Type { get; set; }
    public int Status { get; set; }
    public string Title { get; set; }
    public string Detail { get; set; }
    public List<CustomError> Errors { get; set; }
}

internal sealed class CustomError
{
    public string Code { get; set; }
    public string Description { get; set; }

    // public ErrorType Type { get; set; }
    // ErrorType causes error in Serialization
}
