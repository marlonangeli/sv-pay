"use client";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {GetUserByEmailOrCPFRequest, getUserRequestTypeEnum, useSearchUser} from '@/http/generated';
import {SearchUserSchema} from '@/lib/validations/user-validation.ts';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

export function SearchUserForm() {
  const {mutate, isPending, data: user} = useSearchUser();

  const form = useForm({
    resolver: zodResolver(SearchUserSchema),
    defaultValues: {
      type: 'Email',
      value: ''
    }
  });

  const onSubmit = (values: { type: string, value: string }) => {

    const query: GetUserByEmailOrCPFRequest = {
      type: values.type == 'Email' ? getUserRequestTypeEnum.Email : getUserRequestTypeEnum.CPF,
      value: values.value
    }

    mutate({data: query});
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({field}) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Search type"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="CPF">CPF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input {...field} placeholder="Search value"/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Searching...' : 'Search User'}
          </Button>
        </form>
      </Form>

      {user?.data && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">User Found</h3>
          <p>Name: {user.data.fullName}</p>
          <p>Email: {user.data.email}</p>
          <p>CPF: {user.data.cpf!.formattedValue}</p>
        </div>
      )}
    </div>
  );
}
