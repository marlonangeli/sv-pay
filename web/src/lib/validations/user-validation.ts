import {z} from 'zod';

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const digits = cpf.split('').map(x => parseInt(x));
  const rest = (n: number) => (digits.slice(0, n - 12)
    .reduce((s, x, i) => s + x * (n - i), 0) * 10) % 11 % 10;

  return rest(10) === digits[9] && rest(11) === digits[10];
}

export const CreateUserSchema = z.object({
  firstName: z.string()
    .min(1, "Name is required")
    .max(50, "Name too long"),
  lastName: z.string()
    .min(1, "Name is required")
    .max(50, "Name too long"),
  email: z.string()
    .email("Invalid email")
    .optional()
    .nullable(),
  dateOfBirth: z.coerce.date()
    .refine(date => date <= new Date(), "Birthdate must be in the past")
    .refine(date => date > new Date(new Date().setFullYear(new Date().getFullYear() - 150)),
      "Invalid birth date"),
  cpf: z.string()
    .refine(val => isValidCPF(val), "Invalid CPF")
});

export const SearchUserSchema = z.object({
  type: z.enum(['Email', 'CPF']),
  value: z.string().min(1, "Search value required")
});