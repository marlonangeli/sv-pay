using SV.Pay.Domain.Users;

namespace SV.Pay.UnitTests.User;

public class CPFTests
{
    [Theory]
    [InlineData("000.000.000-00")]
    [InlineData("111.111.111-11")]
    [InlineData("222.222.222-22")]
    [InlineData("333.333.333-33")]
    [InlineData("444.444.444-44")]
    [InlineData("555.555.555-55")]
    [InlineData("666.666.666-66")]
    [InlineData("777.777.777-77")]
    [InlineData("888.888.888-88")]
    [InlineData("999.999.999-99")]
    public void InvalidCPFWithSameDigits_Should_ReturnFalse(string cpf)
    {
        Assert.False(CPF.IsValid(cpf));
    }

    [Theory]
    [InlineData("123.456.789-09")]
    [InlineData("14256482075")]
    [InlineData("447.658.370-92")]
    [InlineData("772.786.810-81")]
    public void ValidCPF_Should_ReturnTrue(string cpf)
    {
        Assert.True(CPF.IsValid(cpf));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void InvalidCPFInput_Should_ReturnFalse(string cpf)
    {
        Assert.False(CPF.IsValid(cpf));
    }

    [Theory]
    [InlineData("123", false)]
    [InlineData("12345678901234", false)]
    [InlineData("123456789", false)]
    [InlineData("12345678909", true)]
    public void CPF_Length_Validation(string cpf, bool expectedValidity)
    {
        Assert.Equal(expectedValidity, CPF.IsValid(cpf));
    }

    [Fact]
    public void CreateCPFWithInvalidValue_Should_ThrowArgumentException()
    {
        Assert.Throws<ArgumentException>(() => new CPF("12345678900"));
    }

    [Theory]
    [InlineData("968.602.200-74", "96860220074")]
    [InlineData("772.786.810-81", "77278681081")]
    public void CPF_Should_StoreUnformattedValue(string formattedCpf, string expectedValue)
    {
        var cpf = new CPF(formattedCpf);
        Assert.Equal(expectedValue, cpf.Value);
    }

    [Theory]
    [InlineData("96860220074", "968.602.200-74")]
    [InlineData("77278681081", "772.786.810-81")]
    public void CPF_Should_FormatCorrectly(string unformattedCpf, string expectedFormat)
    {
        var cpf = new CPF(unformattedCpf);
        Assert.Equal(expectedFormat, cpf.FormattedValue);
        Assert.Equal(expectedFormat, cpf.ToString());
    }

    [Fact]
    public void CPFImplicitConversion_Should_Work()
    {
        CPF cpf = new CPF("968.602.200-74");
        string stringCpf = cpf;
        Assert.Equal("96860220074", stringCpf);
    }
}
