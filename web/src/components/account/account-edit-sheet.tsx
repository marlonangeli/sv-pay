'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, Pencil } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import {
  accountStatusEnum,
  ProblemDetails,
  useBlockAccount,
  useChangeDailyLimit,
  useInactiveAccount,
  getAccountByIdQueryKey,
  AccountStatus
} from "@/http/generated"

const formSchema = z.object({
  dailyLimit: z.number().min(0, "Daily limit must be at least 0"),
  status: z.nativeEnum(accountStatusEnum)
})

export function AccountEditSheet({ account, onSuccess, onError }: {
  account: { id: string; dailyLimit: number; status: AccountStatus }
  onSuccess?: () => void
  onError?: (error: ProblemDetails) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dailyLimit: account.dailyLimit,
      status: account.status
    }
  })

  const refreshData = async () => {
    await queryClient.invalidateQueries({
      queryKey: getAccountByIdQueryKey({ accountId: account.id })
    })
    setIsOpen(false)
    onSuccess?.()
  }

  const { mutate: changeDailyLimit, isPending: isChangingLimit } = useChangeDailyLimit({
    mutation: { onSuccess: refreshData, onError }
  })

  const { mutate: updateBlockStatus, isPending: isChangingStatus } = useBlockAccount({
    mutation: { onSuccess: refreshData, onError }
  })

  const { mutate: updateInactiveStatus, isPending: isChangingInactiveStatus } = useInactiveAccount({
    mutation: { onSuccess: refreshData, onError }
  })

  const handleSave = (data: { dailyLimit: number; status: AccountStatus }) => {
    let hasChanges = false;

    if (data.status !== account.status) {
      hasChanges = true;
      if (account.status === accountStatusEnum.Inactive) {
        updateInactiveStatus({ data: { accountId: account.id, active: true } })
      }
      if (account.status === accountStatusEnum.Blocked) {
        updateBlockStatus({ data: { accountId: account.id, unlock: true } })
      }
      if (data.status === accountStatusEnum.Inactive) {
        updateInactiveStatus({ data: { accountId: account.id, active: false } })
      }
      if (data.status === accountStatusEnum.Blocked) {
        updateBlockStatus({ data: { accountId: account.id, unlock: false } })
      }
    }

    if (data.dailyLimit !== account.dailyLimit) {
      hasChanges = true;
      changeDailyLimit({ data: { accountId: account.id, dailyLimit: data.dailyLimit } })
    }

    if (!hasChanges) setIsOpen(false)
  }

  const isLoading = isChangingLimit || isChangingStatus || isChangingInactiveStatus

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit</SheetTitle>
          <SheetDescription>Update the daily limit and status of this account.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4 py-4">
            <FormField control={form.control} name="dailyLimit" render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Limit</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} disabled={account.status !== accountStatusEnum.Active} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem disabled={account.status === accountStatusEnum.Blocked} value="Inactive">Inactive</SelectItem>
                      <SelectItem disabled={account.status === accountStatusEnum.Inactive} value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <SheetFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
