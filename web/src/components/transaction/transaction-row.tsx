import {useState} from 'react'
import {Badge} from "@/components/ui/badge"
import {TableCell, TableRow} from "@/components/ui/table"
import {Account, Transaction, transactionTypeEnum} from "@/http/generated"
import {ArrowRight} from "lucide-react"
import {Button} from "@/components/ui/button"
import {formatCurrency} from "@/lib/utils"
import {TransactionSheet} from "@/components/transaction/transaction-sheet"
import TransactionTypeIcon from "@/components/transaction/transaction-type-icon";

interface TransactionRowProps {
  transaction: Transaction
  accounts: Account[]
}

export function TransactionRow({transaction}: TransactionRowProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <>
      <TableRow key={transaction.id}>
        <TableCell>{new Date(transaction.date!).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button
            variant="ghost"
            className="group flex h-auto items-center gap-2 p-0 text-left transition-colors hover:text-primary"
            onClick={() => setIsSheetOpen(true)}
          >
            {transaction.description}
            <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"/>
          </Button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium">{transaction.account?.name}</span>
            {transaction.type === transactionTypeEnum.Transfer && (
              <>
                <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                <span className="font-medium">{transaction.relatedAccount?.name}</span>
              </>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <TransactionTypeIcon type={transaction.type!}/>
            <Badge variant="secondary">
              {transaction.type}
            </Badge>
          </div>
        </TableCell>
        <TableCell className={`text-right font-medium ${
          transaction.type === transactionTypeEnum.Deposit ? "text-green-500" :
            transaction.type === transactionTypeEnum.Withdraw ? "text-red-500" : "text-blue-500"
        }`}>
          {formatCurrency(transaction.amount?.amount || 0)}
        </TableCell>
      </TableRow>

      <TransactionSheet
        isOpen={isSheetOpen}
        onCloseAction={() => setIsSheetOpen(false)}
        transactionId={transaction.id!}
      />
    </>
  )
}