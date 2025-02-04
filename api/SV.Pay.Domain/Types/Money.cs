using System.Text.Json.Serialization;

namespace SV.Pay.Domain.Types;

public readonly record struct Money : IComparable<Money>
{
    public long Cents { get; }

    public Money(decimal amount)
    {
        Cents = (long)Math.Round(amount * 100, 0);
    }

    [JsonConstructor]
    public Money(long cents, decimal amount)
    {
        Cents = cents;
    }

    public decimal Amount => Cents / 100m;

    public static Money operator +(Money a, Money b) => new(a.Amount + b.Amount);

    public static Money operator -(Money a, Money b) => new(a.Amount - b.Amount);

    public static Money operator *(Money money, decimal multiplier) => new(money.Amount * multiplier);

    public static Money operator /(Money money, decimal divisor)
    {
        if (divisor == 0)
            throw new DivideByZeroException("Cannot divide money by zero");

        return new Money(money.Amount / divisor);
    }

    public static bool operator >(Money a, Money b) => Compare(a, b) > 0;
    public static bool operator <(Money a, Money b) => Compare(a, b) < 0;
    public static bool operator >=(Money a, Money b) => Compare(a, b) >= 0;
    public static bool operator <=(Money a, Money b) => Compare(a, b) <= 0;

    private static int Compare(Money a, Money b) => a.Cents.CompareTo(b.Cents);

    public int CompareTo(Money other) => Cents.CompareTo(other.Cents);

    public static implicit operator decimal(Money money) => money.Amount;

    public override string ToString() => $"{Amount:C2}";
}
