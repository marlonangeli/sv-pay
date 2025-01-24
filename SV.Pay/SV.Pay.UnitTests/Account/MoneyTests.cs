using SV.Pay.Domain.Types;

namespace SV.Pay.UnitTests.Account;

public class MoneyTests
{
    [Fact]
    public void Money_Should_Create_Correctly()
    {
        var money = new Money(10.50m);
        Assert.Equal(10.50m, money.Amount);
        Assert.Equal(1050, money.Cents);
    }

    [Fact]
    public void Money_Should_Add_Correctly()
    {
        var a = new Money(10.50m);
        var b = new Money(5.25m);
        var result = a + b;
        Assert.Equal(15.75m, result.Amount);
    }

    [Fact]
    public void Money_Should_Subtract_Correctly()
    {
        var a = new Money(10.50m);
        var b = new Money(5.25m);
        var result = a - b;
        Assert.Equal(5.25m, result.Amount);
    }

    [Fact]
    public void Money_Should_Multiply_Correctly()
    {
        var money = new Money(10.50m);
        var result = money * 2;
        Assert.Equal(21m, result.Amount);
    }

    [Fact]
    public void Money_Should_Divide_Correctly()
    {
        var money = new Money(10.50m);
        var result = money / 2;
        Assert.Equal(5.25m, result.Amount);
    }

    [Fact]
    public void Money_Should_Throw_When_Dividing_By_Zero()
    {
        var money = new Money(10.50m);
        Assert.Throws<DivideByZeroException>(() => money / 0);
    }

    [Fact]
    public void Money_Comparison_Should_Work()
    {
        var a = new Money(10.50m);
        var b = new Money(5.25m);
        var c = new Money(10.50m);

        Assert.True(a > b);
        Assert.True(a >= c);
        Assert.True(b < a);
        Assert.True(a == c);
    }

    [Fact]
    public void Money_ToString_Should_Format_Correctly()
    {
        var money = new Money(10.50m);
        Assert.Equal("R$ 10,50", money.ToString());
    }

    [Fact]
    public void Money_Implicit_Conversion_Should_Work()
    {
        Money money = new(10.50m);
        decimal decimalValue = money;
        Assert.Equal(10.50m, decimalValue);
    }
}
