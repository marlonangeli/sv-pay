import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Account, Transaction } from "@/http/generated";
import { TransactionRow } from "@/components/transaction/transaction-row";

interface RecentTransactionsProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const RecentTransactions = ({ transactions, accounts }: RecentTransactionsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Transactions</CardTitle>
      <CardDescription>Last 10 transactions across all accounts</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.slice(0, 10).map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              accounts={accounts}
            />
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
