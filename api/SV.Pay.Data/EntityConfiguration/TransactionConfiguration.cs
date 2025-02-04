using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Data.Extensions;
using SV.Pay.Domain.Transactions;

namespace SV.Pay.Data.EntityConfiguration;

internal sealed class TransactionConfiguration : IEntityTypeConfiguration<Transaction>
{
    public void Configure(EntityTypeBuilder<Transaction> builder)
    {
        builder.ConfigureBaseEntity();

        builder.HasIndex(t => new { t.AccountId, t.Date })
            .IncludeProperties(t => new { t.Amount, t.Type });

        builder.HasIndex(t => new { t.RelatedAccountId, t.Date })
            .HasFilter("[related_account_id] IS NOT NULL");

        builder.Property(t => t.UpdatedAt)
            .IsConcurrencyToken();

        builder.HasOne(t => t.Account)
            .WithMany(a => a.Transactions)
            .HasForeignKey(t => t.AccountId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.RelatedAccount)
            .WithMany()
            .HasForeignKey(t => t.RelatedAccountId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(t => t.Amount)
            .ConfigureMoneyProperty();

        builder.Property(t => t.Type)
            .IsRequired();

        builder.Property(t => t.Date)
            .IsRequired();

        builder.Property(t => t.Description)
            .IsRequired()
            .HasMaxLength(255);
    }
}
