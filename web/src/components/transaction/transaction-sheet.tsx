'use client'

import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ArrowDown, ArrowDownUp, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {TransactionType, transactionTypeEnum, useGetTransactionById, Account} from "@/http/generated"
import { getUserIdFromServer } from "@/lib/cookies"
import { toast } from "sonner"

const TransactionTypeIcon = ({ type }: { type: TransactionType }) => {
  const icons = {
    [transactionTypeEnum.Deposit]: <ArrowUpRight className="h-5 w-5 text-green-500" />,
    [transactionTypeEnum.Withdraw]: <ArrowDown className="h-5 w-5 text-red-500" />,
    [transactionTypeEnum.Transfer]: <ArrowDownUp className="h-5 w-5 text-blue-500" />,
  }
  return icons[type] || null
}

interface TransactionSheetProps {
  isOpen: boolean
  onCloseAction: () => void
  transactionId: string
}

export function TransactionSheet({ isOpen, onCloseAction, transactionId }: TransactionSheetProps) {
  const router = useRouter()

  const { data: transaction, isLoading } = useGetTransactionById({
    transactionId
  }, {
    query: {
      enabled: isOpen,
      select: data => data.data
    }
  })

  const handleAccountClick = async (accountId: string) => {
    const userId = await getUserIdFromServer()
    if ((transaction!.accountId === accountId && transaction!.account!.userId !== userId) ||
      (transaction!.relatedAccountId === accountId && transaction!.relatedAccount!.userId !== userId)) {
      toast.error("You don't have permission to view this account")
      return
    }
    router.push(`/account/${accountId}`)
  }

  const renderAccountInfo = (account: Account) => {
    if (!account) return null

    return (
      <Button
        variant="ghost"
        className="h-auto w-full space-y-2 p-2 text-left hover:bg-secondary"
        onClick={() => handleAccountClick(account.id!)}
      >
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{account.name}</p>
          <Badge variant="outline" className="m-2">{account.type}</Badge>
          <p className="text-sm text-muted-foreground">{account.user?.fullName}</p>
        </div>
      </Button>
    )
  }

  const renderTransferAccounts = () => {
    return (
      <div className="flex flex-col items-center gap-2">
        {renderAccountInfo(transaction!.account!)}
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
        {renderAccountInfo(transaction!.relatedAccount!)}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <Sheet open={isOpen} onOpenChange={onCloseAction}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="pr-8">
          <div className="flex items-center justify-between">
            <SheetTitle>Transaction Details</SheetTitle>
            {transaction && <TransactionTypeIcon type={transaction.type!} />}
          </div>
          <SheetDescription>
            View detailed information about this transaction
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <TransactionDetailsSkeleton />
          ) : transaction ? (
            <>
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary">
                    {transaction.type}
                  </Badge>
                  <p className={`text-2xl font-semibold ${
                    transaction.type === transactionTypeEnum.Deposit ? "text-green-500" :
                      transaction.type === transactionTypeEnum.Withdraw ? "text-red-500" : "text-blue-500"
                  }`}>
                    {formatCurrency(transaction.amount?.amount || 0)}
                  </p>
                </div>

                <div>
                  {transaction.type === transactionTypeEnum.Transfer
                    ? renderTransferAccounts()
                    : renderAccountInfo(transaction.account!)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="rounded-md bg-secondary p-3 text-sm">
                    {transaction.description || 'No description'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Transaction Date</h3>
                  <p className="text-sm">
                    {new Date(transaction.date!).toLocaleDateString()} at{' '}
                    {new Date(transaction.date!).toLocaleTimeString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p className="text-sm">
                    {new Date(transaction.createdAt!).toLocaleDateString()} at{' '}
                    {new Date(transaction.createdAt!).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>Transaction not found</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TransactionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  )
}
