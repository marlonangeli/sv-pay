using System.ComponentModel.DataAnnotations;
using System.Data.SqlTypes;
using System.Transactions;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;

namespace SV.Pay.Domain.Accounts;

public class Account : Entity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public List<Transaction>? Transactions { get; set; }
    [ConcurrencyCheck] public decimal Balance { get; set; }
    public decimal DailyLimit { get; set; }
    public AccountStatus Status { get; set; }
    public AccountType Type { get; set; }
}
