using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Domain.Accounts;
using SV.Pay.Domain.Types;

namespace SV.Pay.Data.EntityConfiguration;

internal sealed class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasOne(a => a.User)
            .WithMany(u => u.Accounts)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(a => a.Balance)
            .IsRequired()
            .HasConversion(money => money.Cents, value => new Money(value))
            .HasColumnType("decimal(18,2)");

        builder.Property(a => a.DailyLimit)
            .IsRequired()
            .HasConversion(money => money.Cents, value => new Money(value))
            .HasColumnType("decimal(18,2)");
    }
}
