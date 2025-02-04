using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Domain.Users;

public sealed class User : Entity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public DateOnly BirthDate { get; set; }
    public CPF CPF { get; set; }
    public List<Account>? Accounts { get; set; }

    public string FullName => $"{FirstName} {LastName}";
}
