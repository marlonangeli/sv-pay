namespace SV.Pay.Domain.Users;

public class CPF
{
    public CPF(string value)
    {
        if (!IsValid(value))
        {
            throw new ArgumentException("Invalid CPF");
        }

        Value = value;
    }

    public string Value { get; }

    public static bool IsValid(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return false;
        }

        value = value.Replace(".", "").Replace("-", "");

        if (value.Length != 11)
        {
            return false;
        }

        if (value.Distinct().Count() == 1)
        {
            return false;
        }

        string cpf = value[..9];
        string firstDigit = CalculateDigit(cpf);
        cpf += firstDigit;
        string secondDigit = CalculateDigit(cpf);

        return value.EndsWith(firstDigit + secondDigit);
    }

    private static string CalculateDigit(string cpf)
    {
        int sum = 0;

        for (int i = 0; i < cpf.Length; i++)
        {
            sum += int.Parse(cpf[i].ToString()) * (cpf.Length + 1 - i);
        }

        int digit = 11 - sum % 11;
        return digit >= 10 ? "0" : digit.ToString();
    }

    public override string ToString() => Value;
}
