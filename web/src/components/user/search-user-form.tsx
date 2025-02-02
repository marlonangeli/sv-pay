import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserRequestTypeEnum, useSearchUser } from '@/http/generated';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UserResult } from '@/components/user/user-search-result';
import {setUserIdCookieInServer} from "@/lib/cookies.ts";
import {useRouter} from "next/navigation";

const formSchema = z.object({
  searchType: z.enum([getUserRequestTypeEnum.Email, getUserRequestTypeEnum.CPF]),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Please enter a valid CPF')
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

export const SearchUserForm = () => {
  const router = useRouter();

  const [searchResult, setSearchResult] = React.useState<{
    user?: {
      id: string;
      name: string;
      email: string;
      cpf: string;
      initials: string;
    };
    error?: string;
  }>({});

  const { mutate: searchUser, isPending } = useSearchUser({
    mutation: {
      onSuccess: (data) => {
        const user = data.data;
        setSearchResult({
          user: {
            id: user.id || '',
            name: user.fullName || '',
            email: user.email || '',
            initials: user.fullName?.split(' ').map(n => n[0]).join('') || '',
            cpf: user.cpf?.formattedValue || ''
          }
        });
      },
      onError: () => {
        setSearchResult({ error: 'User not found' });
      }
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

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  };

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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search User
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Search User</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="searchType"
              render={({ field }) => (
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
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={getUserRequestTypeEnum.Email}>Email</SelectItem>
                      <SelectItem value={getUserRequestTypeEnum.CPF}>CPF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {searchType === getUserRequestTypeEnum.Email && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {searchType === getUserRequestTypeEnum.CPF && (
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
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
                        placeholder="123.456.789-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Searching...' : 'Search'}
            </Button>

            {(searchResult.user || searchResult.error) && (
              <UserResult user={searchResult.user} error={searchResult.error} onClick={async () => {
                if (searchResult.user) {
                  await setUserIdCookieInServer(searchResult.user.id);
                }
                router.push('/dashboard');
              }}/>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};