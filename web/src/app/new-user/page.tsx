'use client'

import React from "react"
import {useRouter} from 'next/navigation'
import {zodResolver} from '@hookform/resolvers/zod'
import {ControllerRenderProps, useForm} from 'react-hook-form'
import {z} from 'zod'
import {format} from 'date-fns'
import {CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Loader2} from 'lucide-react'
import {toast} from 'sonner'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar"
import {useCreateUser} from '@/http/generated'
import {setUserIdCookieInServer} from "@/lib/cookies.ts"
import AppHeader from "@/components/app-header.tsx"
import {cn, CPF_REGEX, formatCPF} from "@/lib/utils.ts"

const formSchema = z.object({
  firstName: z.string()
    .min(1, {message: "First name is required"})
    .max(50, {message: "First name must be at most 50 characters"}),
  lastName: z.string()
    .min(1, {message: "Last name is required"})
    .max(50, {message: "Last name must be at most 50 characters"}),
  email: z.string()
    .min(1, {message: "Email is required"})
    .email({message: "Invalid email address"}),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine(date => {
    const today = new Date()
    const minDate = new Date()
    minDate.setFullYear(today.getFullYear() - 150)
    return date > minDate && date < today
  }, {message: "Must be between 150 years ago and today"}),
  cpf: z.string()
    .regex(CPF_REGEX, {message: "Invalid CPF format. Use XXX.XXX.XXX-XX"})
})

export default function CreateUserPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: undefined,
      cpf: ''
    }
  })

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    onChange(formatCPF(e.target.value))
  }

  const {mutate: createUser, isPending} = useCreateUser({
    mutation: {
      onSuccess: ({data: userId}) => {
        toast.success('User created successfully', {
          action: {
            label: 'View User',
            onClick: async () => {
              await setUserIdCookieInServer(userId)
              router.push("/dashboard")
            }
          },
          duration: 10000
        })
      },
      onError: (error) => {
        toast.error('Failed to create user', {
          description: error.errors ? error.errors?.map(e => e.description).join(", ") : error.detail
        })
      }
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createUser({
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth
      }
    })
  }

  // A small subcomponent for the date picker with year navigation.
  function DatePickerField({field}: {
    field: ControllerRenderProps<{
      email: string
      cpf: string
      firstName: string
      lastName: string
      dateOfBirth: Date
    }, "dateOfBirth">
  }) {
    // Use a local state for the displayed month. Initialize it to the field value (if present) or today.
    const [selectedMonth, setSelectedMonth] = React.useState<Date>(field.value || new Date())

    return (
      <FormItem className="flex flex-col">
        <FormLabel>Date of Birth</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  "pl-3 text-left font-normal focus-visible:ring-blue-500",
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
            {/* Custom header for year navigation */}
            <div className="flex items-center justify-between p-2">
              <Button
                variant="ghost"
                onClick={() =>
                  setSelectedMonth(
                    new Date(selectedMonth.getFullYear() - 1, selectedMonth.getMonth())
                  )
                }
              >
                <ChevronLeftIcon className="h-4 w-4"/>
              </Button>
              <span className="font-medium">
                {format(selectedMonth, "yyyy")}
              </span>
              <Button
                variant="ghost"
                onClick={() =>
                  setSelectedMonth(
                    new Date(selectedMonth.getFullYear() + 1, selectedMonth.getMonth())
                  )
                }
              >
                <ChevronRightIcon className="h-4 w-4"/>
              </Button>
            </div>
            <Calendar
              mode="single"
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              selected={field.value}
              onSelect={field.onChange}
              disabled={date =>
                date > new Date() ||
                date < new Date(new Date().setFullYear(new Date().getFullYear() - 150))
              }
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        <FormMessage className="text-red-500"/>
      </FormItem>
    )
  }

  return (
    <>
      <AppHeader/>
      <div className="container mx-auto max-w-2xl space-y-8 p-8 mt-24">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New User</CardTitle>
            <CardDescription className="text-gray-500">
              Fill in the details below to create a new user account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="focus-visible:ring-blue-500"/>
                        </FormControl>
                        <FormMessage className="text-red-500"/>
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
                          <Input {...field} className="focus-visible:ring-blue-500"/>
                        </FormControl>
                        <FormMessage className="text-red-500"/>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="focus-visible:ring-blue-500"/>
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Updated Date of Birth Field */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({field}) => <DatePickerField field={field}/>}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XXX.XXX.XXX-XX"
                          maxLength={14}
                          onChange={(e) => handleCPFChange(e, field.onChange)}
                          value={field.value}
                          onBlur={field.onBlur}
                          className="focus-visible:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  Create User
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
