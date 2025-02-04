'use client'

import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {z} from 'zod'

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {accountTypeEnum, getUserByIdQueryKey, useCreateAccount} from '@/http/generated'
import {toast} from 'sonner'
import {Loader2} from 'lucide-react'
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {useQueryClient} from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}).max(32, {message: "Name must be at most 32 characters"}),
  type: z.nativeEnum(accountTypeEnum),
  initialBalance: z.number().min(0, {message: "Initial balance must be zero or positive"}).optional(),
  dailyLimit: z.number().min(0.01, {message: "Daily limit must be greater than zero"}),
})

export default function CreateAccountPage({userId}: { userId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dailyLimit: 0
    }
  })

  const {mutate: createAccount, isPending} = useCreateAccount({
    mutation: {
      onSuccess: async ({data: accountId}) => {
        await queryClient.invalidateQueries({
          queryKey: getUserByIdQueryKey({userId})
        })
        toast.success('Account created successfully', {
          action: {
            label: 'View Account',
            onClick: () => {
              router.push(`/account/${accountId}`)
            }
          },
          duration: 10000
        });
        router.push('/dashboard')
      },
      onError: (error) => {
        toast.error(error.detail, {
          description: error.errors?.map((e) => e.description).join(", ")
        })
      }
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!userId) return
    data.initialBalance = data.initialBalance || 0
    createAccount({data: {userId, ...data}})
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={accountTypeEnum.Digital}>{accountTypeEnum.Digital}</SelectItem>
                          <SelectItem value={accountTypeEnum.Investment}>{accountTypeEnum.Investment}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialBalance"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Initial Balance</FormLabel>
                    <FormControl>
                      <Input
                        id="initialBalance"
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const formattedValue = rawValue.match(/^\d*\.?\d{0,2}/)?.[0] || '';
                          const numericValue = formattedValue ? Number(formattedValue) : 0;
                          field.onChange(numericValue);
                        }}
                      />
                    </FormControl>
                    <FormDescription>If set, this will create a initial transaction</FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyLimit"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Daily Limit</FormLabel>
                    <FormControl>
                      <Input
                        id="dailyLimit"
                        type="number"
                        min="0.01"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const formattedValue = rawValue.match(/^\d*\.?\d{0,2}/)?.[0] || '';
                          const numericValue = formattedValue ? Number(formattedValue) : 0;
                          field.onChange(numericValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
