using System.ComponentModel.DataAnnotations;
using SV.Pay.Domain.Types;
using SV.Pay.Domain.Users;
using SV.Pay.Shared;
using Transaction = SV.Pay.Domain.Transactions.Transaction;

namespace SV.Pay.Domain.Accounts;

public class Account : Entity
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public IEnumerable<Transaction>? Transactions { get; set; }
    [ConcurrencyCheck] public Money Balance { get; set; }
    public Money DailyLimit { get; set; }
    public AccountStatus Status { get; set; }
    public AccountType Type { get; set; }
}
