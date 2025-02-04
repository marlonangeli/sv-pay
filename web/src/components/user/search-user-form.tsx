import React from 'react';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {getUserRequestTypeEnum, ProblemDetails, User, useSearchUser} from '@/http/generated';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {CPF_REGEX, formatCPF} from '@/lib/utils';


const formSchema = z.object({
  searchType: z.enum([getUserRequestTypeEnum.Email, getUserRequestTypeEnum.CPF]),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  cpf: z
    .string()
    .regex(CPF_REGEX, 'Please enter a valid CPF')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    if (data.searchType === getUserRequestTypeEnum.Email) {
      return !!data.email;
    }
    return !!data.cpf;
  },
  {
    message: "Please enter a value",
    path: ['email', 'cpf'],
  }
);

type FormValues = z.infer<typeof formSchema>;

type SearchUserFormProps = {
  onUserFound: (user: User) => void
  onError: (error: ProblemDetails) => void
}

export const SearchUserForm = ({onUserFound, onError}: SearchUserFormProps) => {

  const {mutate: searchUser, isPending} = useSearchUser({
    mutation: {
      onSuccess: (response) => onUserFound(response.data),
      onError: (error) => onError(error)
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchType: getUserRequestTypeEnum.Email,
      email: '',
      cpf: '',
    },
  });

  const searchType = form.watch('searchType');

  const onSubmit = (data: FormValues) => {
    const value = data.searchType === getUserRequestTypeEnum.Email
      ? data.email
      : data.cpf?.replace(/\D/g, '');

    searchUser({
      data: {
        type: data.searchType,
        value
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="searchType"
          render={({field}) => (
            <FormItem>
              <FormLabel>Search Type</FormLabel>
              <Select
                onValueChange={(value: typeof field.value) => {
                  field.onChange(value);
                  // Clear both fields when switching types
                  form.setValue('email', '');
                  form.setValue('cpf', '');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={getUserRequestTypeEnum.Email}>Email</SelectItem>
                  <SelectItem value={getUserRequestTypeEnum.CPF}>CPF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />

        {searchType === getUserRequestTypeEnum.Email && (
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@example.com"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        )}

        {searchType === getUserRequestTypeEnum.CPF && (
          <FormField
            control={form.control}
            name="cpf"
            render={({field}) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      const formattedValue = formatCPF(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    placeholder="XXX.XXX.XXX-XX"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </form>
    </Form>
  );
};