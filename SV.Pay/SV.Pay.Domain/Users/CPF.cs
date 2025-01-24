using System.Text.RegularExpressions;

namespace SV.Pay.Domain.Users;

public record CPF
{
    private readonly string _value;

    public CPF(string value)
    {
        if (!IsValid(value))
        {
            throw new ArgumentException("Invalid CPF");
        }

        _value = Sanitize(value);
    }

    public string Value => _value;

    public string FormattedValue => Format(_value);

    public static bool IsValid(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        string cpf = Sanitize(value);

        if (cpf.Length != 11)
        {
            return false;
        }

        if (cpf.Distinct().Count() == 1)
        {
            return false;
        }

        string baseNumber = cpf[..9];
        string firstDigit = CalculateDigit(baseNumber);
        baseNumber += firstDigit;
        string secondDigit = CalculateDigit(baseNumber);

        return cpf.EndsWith(firstDigit + secondDigit);
    }

    private static string Sanitize(string value)
    {
        return Regex.Replace(value, @"[^\d]", "");
    }

    private static string Format(string cpf)
    {
        if (cpf.Length != 11)
        {
            return cpf;
        }

        return $"{cpf[..3]}.{cpf.Substring(3, 3)}.{cpf.Substring(6, 3)}-{cpf.Substring(9, 2)}";
    }

    private static string CalculateDigit(string cpf)
    {
        int sum = 0;

        for (int i = 0; i < cpf.Length; i++)
        {
            sum += int.Parse(cpf[i].ToString()) * (cpf.Length + 1 - i);
        }

        int digit = 11 - (sum % 11);
        return digit >= 10 ? "0" : digit.ToString();
    }

    public override string ToString() => FormattedValue;

    public static implicit operator string(CPF cpf) => cpf.Value;
}
