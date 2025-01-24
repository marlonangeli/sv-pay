namespace SV.Pay.Api.Endpoints.Users;

public sealed record GetUserByEmailOrCPFRequest(GetUserRequestType Type, string Value);

public enum GetUserRequestType
{
    Email,
    CPF
}
