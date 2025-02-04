using Microsoft.EntityFrameworkCore;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Users;

namespace SV.Pay.Application.Abstractions.Data;

public interface IPaymentsDbContext
{
    DbSet<User> Users { get; }
    DbSet<Account> Accounts { get; }
    DbSet<Transaction> Transactions { get; }

    DbContext Instance { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
