"use client";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useCreateUser} from '@/http/generated/hooks/useCreateUser'
import {CreateUserSchema} from '@/lib/validations/user-validation.ts';
import {CreateUserMutationRequest} from '@/http/generated';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {CalendarIcon} from 'lucide-react';

export function CreateUserForm() {
  const {mutate, data, error, isPending} = useCreateUser({
    mutation: {
      onSuccess: (response) => {
        console.log("boa guri")
        console.log(response);
      },
      onError: (error) => {
        console.log("cara deu erro")
        console.error(error);
      }
    }
  });

  const form = useForm({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date(),
      cpf: ''
    }
  });

  const onSubmit = (values: {
    firstName: string,
    lastName: string,
    email: string,
    dateOfBirth: Date,
    cpf: string
  }) => {
    const request: CreateUserMutationRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
      cpf: values.cpf
    }

    mutate({data: request});
  };

  return (
    <>
      <div>
        {isPending && <div>Creating user...</div>}
        {error && <div>{error.detail}</div>}
        {data && <div>{data.data}</div>}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({field}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({field}) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({field}) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="000.000.000-00"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </Form>
    </>
  );
}