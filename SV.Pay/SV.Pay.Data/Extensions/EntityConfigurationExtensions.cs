using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Shared;

namespace SV.Pay.Data.Extensions;

internal static class EntityConfigurationExtensions
{
    internal static void ConfigureBaseEntity<T> (this EntityTypeBuilder<T> builder) where T : Entity
    {
        builder.ToTable(typeof(T).Name)
            .HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .IsRequired()
            .ValueGeneratedNever();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired(false);
    }
}
