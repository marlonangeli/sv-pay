import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Account, Transaction, TransactionType, transactionTypeEnum } from "@/http/generated";
import { ArrowDown, ArrowDownUp, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface TransactionRowProps {
  transaction: Transaction;
  accounts: Account[];
}

const TransactionTypeIcon = ({ type }: { type: TransactionType }) => {
  const icons = {
    [transactionTypeEnum.Deposit]: <ArrowUpRight className="h-4 w-4 text-green-500" />,
    [transactionTypeEnum.Withdraw]: <ArrowDown className="h-4 w-4 text-red-500" />,
    [transactionTypeEnum.Transfer]: <ArrowDownUp className="h-4 w-4 text-blue-500" />,
  };
  return icons[type] || null;
};

export const TransactionRow = ({ transaction, accounts }: TransactionRowProps) => {
  const sourceAccount = accounts.find(account => account.id === transaction.accountId);
  const targetAccount = accounts.find(account => account.id === transaction.relatedAccountId);

  return (
    <TableRow>
      <TableCell>{new Date(transaction.date!).toLocaleDateString()}</TableCell>
      <TableCell>
        <Link
          href={`/transactions/${transaction.id}`}
          className="group flex items-center gap-2 transition-colors hover:text-primary"
        >
          {transaction.description}
          <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className="font-medium">{transaction.account?.name}</span>
          {transaction.type === transactionTypeEnum.Transfer && (
            <>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{transaction.relatedAccount?.name}</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <TransactionTypeIcon type={transaction.type!} />
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
  );
};