namespace SV.Pay.Domain.Types;

public readonly record struct Money
{
    public long Cents { get; }

    public Money(decimal amount)
    {
        Cents = (long)(amount * 100);
    }

    private decimal ToDecimal() => Cents / 100m;

    public static implicit operator decimal(Money money) => money.ToDecimal();
}
