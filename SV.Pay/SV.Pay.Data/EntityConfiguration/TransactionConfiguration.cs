using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Domain.Transactions;
using SV.Pay.Domain.Types;

namespace SV.Pay.Data.EntityConfiguration;

internal sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.HasOne(t => t.Account)
            .WithMany(a => a.Transactions)
            .HasForeignKey(t => t.AccountId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.RelatedAccount)
            .WithMany()
            .HasForeignKey(t => t.RelatedAccountId)
            .IsRequired(false);

        builder.Property(t => t.Amount)
            .IsRequired()
            .HasConversion(money => money.Cents, value => new Money(value / 100m))
            .HasColumnType("decimal(18,2)");

        builder.Property(t => t.Type)
            .IsRequired();

        builder.Property(t => t.Date)
            .IsRequired();

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(255);
    }
}
