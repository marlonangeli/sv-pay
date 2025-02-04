'use client'

import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import {format} from 'date-fns'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {CalendarIcon, ChevronDown, ChevronUp} from "lucide-react"
import {
  Account,
  accountStatusEnum,
  ProblemDetails,
  TransactionType,
  transactionTypeEnum,
  useDeposit,
  useGetUserById,
  User,
  useTransfer,
  useWithdraw
} from '@/http/generated'
import {toast} from "sonner"
import {AccountCard} from '@/components/account/account-card'
import {SearchUserForm} from "@/components/user/search-user-form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {motion} from 'framer-motion'
import {Separator} from "@/components/ui/separator.tsx";
import {Badge} from "@/components/ui/badge.tsx";

const transactionSchema = z.object({
  type: z.nativeEnum(transactionTypeEnum),
  accountId: z.string().nonempty(),
  relatedAccountId: z.string().optional(),
  amount: z.number().positive().refine(
    (val) => /^\d+(\.\d{1,2})?$/.test(val.toFixed(2)),
    {message: "Amount must be a positive number with up to 2 decimal places"}
  ),
  description: z.string().min(1),
  date: z.date(),
})

export default function CreateTransactionPage({userId}: { userId: string }) {
  const [selectedType, setSelectedType] = useState<TransactionType | null>()
  const [destinationUser, setDestinationUser] = useState<User | null>(null)
  const [destinationAccounts, setDestinationAccounts] = useState<Account[]>([])
  const [expandedSection, setExpandedSection] = useState<'source' | 'destination' | null>(null)
  const [searchExpanded, setSearchExpanded] = useState(false);

  const depositMutation = useDeposit()
  const withdrawMutation = useWithdraw()
  const transferMutation = useTransfer()

  const {data: userData, isPending, refetch: refetchUserData} = useGetUserById(
    {userId},
    {query: {select: response => response.data}}
  )

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      relatedAccountId: '',
      date: new Date(),
      amount: 0,
      description: ''
    }
  })

  const isFormValid = form.formState.isValid &&
    (selectedType !== transactionTypeEnum.Transfer || !!form.getValues('relatedAccountId'))

  const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      const onSuccess = () => {
        toast.success('Transaction completed successfully')
        refetchUserData()
        form.reset()
        setDestinationUser(null)
        setDestinationAccounts([])
        setExpandedSection(null)
        setSelectedType(null)
        setSearchExpanded(false)
      }

      const onError = (error: ProblemDetails) => {
        toast.error(error.detail, {
          description: error.errors?.map((e) => e.description).join(", ")
        })
      }

      const processData = selectedType === transactionTypeEnum.Transfer
        ? data
        : {
          ...data,
          relatedAccountId: undefined
        }

      switch (selectedType) {
        case transactionTypeEnum.Deposit:
          await depositMutation.mutateAsync({data: processData}, {onError, onSuccess})
          break
        case transactionTypeEnum.Withdraw:
          await withdrawMutation.mutateAsync({data: processData}, {onError, onSuccess})
          break
        case transactionTypeEnum.Transfer:
          await transferMutation.mutateAsync({data: processData}, {onError, onSuccess})
          break
        default:
          toast.error('Please select a transaction type')
      }
    } catch {
      toast.error('An error occurred while processing the transaction')
    }
  }

  const AccountSection = ({
                            title,
                            accounts,
                            onAccountSelect,
                            selectedAccountId,
                            expanded,
                            onToggleExpand,
                            showBalance,
                            selectedAccount
                          }: {
    title: string,
    accounts?: Account[],
    onAccountSelect: (accountId: string) => void,
    selectedAccountId?: string,
    expanded?: boolean,
    onToggleExpand?: () => void,
    showBalance: boolean,
    selectedAccount?: Account
  }) => {
    if (!accounts || accounts.length === 0) {
      return (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-sm text-muted-foreground">No accounts available</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className={cn(
        "w-full transition-all duration-300 ease-in-out",
        expanded ? "shadow-lg" : "shadow-sm"
      )}>
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between p-4"
          onClick={onToggleExpand}
        >
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {!expanded && selectedAccount && (
              <Badge variant="default" className="text-xs">{selectedAccount.name}</Badge>
            )}
            {onToggleExpand &&
              (expanded ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>)}
          </div>
        </CardHeader>


        <motion.div
          initial={{height: 0, opacity: 0}}
          animate={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0
          }}
          transition={{duration: 0.3}}
          className="overflow-hidden"
        >
          <CardContent className="p-4">
            <ScrollArea className="h-64 w-full">
              <div className="grid grid-cols-1 gap-3">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onClick={() => {
                      if (account.status === accountStatusEnum.Active) {
                        onAccountSelect(account.id!)
                        setExpandedSection(null)
                      }
                    }}
                    selected={selectedAccountId === account.id}
                    showBalance={showBalance}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </motion.div>
      </Card>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-center">Create New Transaction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8">
        {/* Left Column: Transaction Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Transaction Type */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Transaction Type</FormLabel>
                        <Select
                          onValueChange={(value: TransactionType) => {
                            field.onChange(value)
                            setSelectedType(value)
                            form.setValue('relatedAccountId', '')
                            setDestinationUser(null)
                            setDestinationAccounts([])
                            setExpandedSection(null)
                            setSearchExpanded(true)
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(transactionTypeEnum).map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  {/* Amount */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="pl-8"
                              value={field.value}
                              onChange={(e) => {
                                const rawValue = e.target.value;
                                const formattedValue = rawValue.match(/^\d*\.?\d{0,2}/)?.[0] || '';
                                const numericValue = formattedValue ? Number(formattedValue) : 0;
                                field.onChange(numericValue);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter transaction description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({field}) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select date</span>
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
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Vertical Separator */}
        <Separator orientation="vertical" className="hidden lg:block h-auto"/>

        {/* Right Column: Account Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Account Selection</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Source Accounts Section */}
              {!isPending && (
                <AccountSection
                  title="Source Account"
                  accounts={userData!.accounts!}
                  onAccountSelect={(accountId) => form.setValue('accountId', accountId)}
                  selectedAccountId={form.watch('accountId')}
                  expanded={expandedSection === 'source'}
                  onToggleExpand={() => setExpandedSection(
                    expandedSection === 'source' ? null : 'source'
                  )}
                  showBalance={true}
                  selectedAccount={userData!.accounts!.find(a => a.id === form.watch('accountId'))}
                />
              )}

              {/* Destination Handling for Transfer */}
              {selectedType === transactionTypeEnum.Transfer && (
                <>
                  <Card className="overflow-hidden">
                    <CardHeader
                      className="cursor-pointer flex flex-row items-center justify-between p-4"
                      onClick={() => setSearchExpanded(!searchExpanded)}
                    >
                      <CardTitle className="text-sm font-medium">Recipient Search</CardTitle>
                      {searchExpanded ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}
                    </CardHeader>
                    <motion.div
                      initial={{height: 0}}
                      animate={{height: searchExpanded ? 'auto' : 0}}
                      transition={{duration: 0.3}}
                      className="overflow-hidden"
                    >
                      <CardContent className="p-4">
                        <SearchUserForm
                          onUserFound={(user) => {
                            setDestinationUser(user)
                            setDestinationAccounts(user.accounts || [])
                            form.setValue('relatedAccountId', '')
                            setExpandedSection('destination')
                            setSearchExpanded(false)
                          }}
                          onError={error => toast.error(error.errors ? error.errors.map(e => e.description).join(", ") : error.detail!)}
                        />
                      </CardContent>
                    </motion.div>
                  </Card>

                  {destinationUser && (
                    <AccountSection
                      title={`Destination: ${destinationUser.fullName}`}
                      accounts={destinationAccounts}
                      onAccountSelect={(accountId) => form.setValue('relatedAccountId', accountId)}
                      selectedAccountId={form.watch('relatedAccountId')}
                      expanded={expandedSection === 'destination'}
                      onToggleExpand={() => setExpandedSection(
                        expandedSection === 'destination' ? null : 'destination'
                      )}
                      showBalance={false}
                      selectedAccount={destinationAccounts.find(a => a.id === form.watch('relatedAccountId'))}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Centered Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          className="w-full max-w-md"
          onClick={form.handleSubmit(onSubmit)}
          disabled={
            !isFormValid ||
            depositMutation.isPending ||
            withdrawMutation.isPending ||
            transferMutation.isPending
          }
        >
          Submit Transaction
        </Button>
      </div>
    </div>
  )
}
