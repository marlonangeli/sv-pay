using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Data.Extensions;
using SV.Pay.Domain.Accounts;

namespace SV.Pay.Data.EntityConfiguration;

internal sealed class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ConfigureBaseEntity();

        builder.HasOne(a => a.User)
            .WithMany(u => u.Accounts)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(a => a.UpdatedAt)
            .IsConcurrencyToken();

        builder.Property(a => a.Balance)
            .ConfigureMoneyProperty();

        builder.Property(a => a.DailyLimit)
            .ConfigureMoneyProperty();

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(32);
    }
}
