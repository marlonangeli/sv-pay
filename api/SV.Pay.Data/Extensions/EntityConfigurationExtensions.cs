using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Domain.Types;
using SV.Pay.Shared;

namespace SV.Pay.Data.Extensions;

internal static class EntityConfigurationExtensions
{
    internal static void ConfigureBaseEntity<T> (this EntityTypeBuilder<T> builder) where T : Entity
    {
        builder.ToTable($"{typeof(T).Name.ToLower()}s")
            .HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .ValueGeneratedNever();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();
    }

    internal static PropertyBuilder<Money> ConfigureMoneyProperty(
        this PropertyBuilder<Money> builder)
    {
        return builder
            .IsRequired()
            .HasConversion(
                money => money.Cents,
                value => new Money(value / 100m))
            .HasColumnType("decimal(18,2)")
            .HasPrecision(18, 2);
    }
}
