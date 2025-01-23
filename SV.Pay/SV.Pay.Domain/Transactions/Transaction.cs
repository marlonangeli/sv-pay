using SV.Pay.Domain.Accounts;
using SV.Pay.Shared;

namespace SV.Pay.Domain.Transactions;

public class Transaction : Entity
{
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public Guid AccountId { get; set; }
    public Account? Account { get; set; }
    public Guid? RelatedAccountId { get; set; }
    public Account? RelatedAccount { get; set; }
    public TransactionType Type { get; set; }
    public string? Description { get; set; }
}
