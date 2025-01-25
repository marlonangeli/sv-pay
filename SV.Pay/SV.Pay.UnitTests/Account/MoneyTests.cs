using SV.Pay.Domain.Types;

namespace SV.Pay.UnitTests.Account;

public class MoneyTests
{
    [Theory]
    [InlineData(0, 0)]
    [InlineData(10.50, 1050)]
    [InlineData(-5.25, -525)]
    [InlineData(0.01, 1)]
    [InlineData(0.001, 0)]  // Rounding behavior test
    public void Money_Constructor_ShouldHandleDifferentInputs(decimal amount, long expectedCents)
    {
        var money = new Money(amount);
        Assert.Equal(expectedCents, money.Cents);
    }

    [Theory]
    [InlineData(10.50, 5.25, 15.75)]
    [InlineData(-5.25, 3.00, -2.25)]
    [InlineData(0, 10.50, 10.50)]
    public void Money_Addition_ShouldWorkCorrectly(decimal a, decimal b, decimal expected)
    {
        var moneyA = new Money(a);
        var moneyB = new Money(b);
        var result = moneyA + moneyB;
        Assert.Equal(expected, result.Amount);
    }

    [Theory]
    [InlineData(10.50, 5.25, 5.25)]
    [InlineData(3.00, 5.25, -2.25)]
    [InlineData(10.50, 0, 10.50)]
    public void Money_Subtraction_ShouldWorkCorrectly(decimal a, decimal b, decimal expected)
    {
        var moneyA = new Money(a);
        var moneyB = new Money(b);
        var result = moneyA - moneyB;
        Assert.Equal(expected, result.Amount);
    }

    [Theory]
    [InlineData(10.50, 2, 21.00)]
    [InlineData(5.25, 0, 0)]
    [InlineData(10.50, -2, -21.00)]
    [InlineData(0, 5, 0)]
    public void Money_Multiplication_ShouldWorkCorrectly(decimal amount, decimal multiplier, decimal expected)
    {
        var money = new Money(amount);
        var result = money * multiplier;
        Assert.Equal(expected, result.Amount);
    }

    [Theory]
    [InlineData(10.50, 2, 5.25)]
    [InlineData(0, 5, 0)]
    [InlineData(10.50, -2, -5.25)]
    public void Money_Division_ShouldWorkCorrectly(decimal amount, decimal divisor, decimal expected)
    {
        var money = new Money(amount);
        var result = money / divisor;
        Assert.Equal(expected, result.Amount);
    }

    [Fact]
    public void Money_Division_ShouldThrowOnZeroDivisor()
    {
        var money = new Money(10.50m);
        Assert.Throws<DivideByZeroException>(() => money / 0);
    }

    [Theory]
    [InlineData(10.50, 5.25, true)]
    [InlineData(5.25, 10.50, false)]
    [InlineData(10.50, 10.50, false)]
    public void Money_GreaterThan_ShouldWorkCorrectly(decimal a, decimal b, bool expected)
    {
        var moneyA = new Money(a);
        var moneyB = new Money(b);
        Assert.Equal(expected, moneyA > moneyB);
    }

    [Theory]
    [InlineData(10.50, 5.25, true)]
    [InlineData(5.25, 10.50, false)]
    [InlineData(10.50, 10.50, true)]
    public void Money_GreaterThanOrEqual_ShouldWorkCorrectly(decimal a, decimal b, bool expected)
    {
        var moneyA = new Money(a);
        var moneyB = new Money(b);
        Assert.Equal(expected, moneyA >= moneyB);
    }

    [Fact]
    public void Money_ToString_ShouldFormatCorrectly()
    {
        var testCases = new[]
        {
            (10.50m, "R$ 10,50"),
            (0m, "R$ 0,00"),
            (-5.25m, "-R$ 5,25")
        };

        foreach (var (amount, expected) in testCases)
        {
            var money = new Money(amount);
            Assert.Equal(expected, money.ToString());
        }
    }

    [Theory]
    [InlineData(10.50)]
    [InlineData(0)]
    [InlineData(-5.25)]
    public void Money_ImplicitConversionToDecimal_ShouldWork(decimal amount)
    {
        Money money = new(amount);
        decimal decimalValue = money;
        Assert.Equal(amount, decimalValue);
    }

    [Fact]
    public void Money_CompareTo_ShouldWorkCorrectly()
    {
        var moneyA = new Money(10.50m);
        var moneyB = new Money(5.25m);
        var moneyC = new Money(10.50m);

        Assert.True(moneyA.CompareTo(moneyB) > 0);
        Assert.True(moneyA.CompareTo(moneyC) == 0);
        Assert.True(moneyB.CompareTo(moneyA) < 0);
    }
}
