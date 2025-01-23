using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SV.Pay.Domain.Users;

namespace SV.Pay.Data.EntityConfiguration;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(u => u.CPF)
            .IsUnique();

        builder.Property(u => u.CPF)
            .IsRequired()
            .HasConversion(cpf => cpf.Value, value => new CPF(value))
            .HasMaxLength(11);

        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(u => u.BirthDate)
            .IsRequired();
    }
}
