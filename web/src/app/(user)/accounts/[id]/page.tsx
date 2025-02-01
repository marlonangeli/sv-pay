'use client'

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Account, useGetAccountById, useGetMonthlyAccountExtract} from "@/http/generated";
import {useParams} from "next/navigation";
import {AccountHeader} from "@/components/account/account-header";
import {MonthlyExtractChart} from "@/components/account/monthly-extract-chart";
import {TransactionRow} from "@/components/transaction/transaction-row";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useState} from "react";
import {Calendar as CalendarIcon, Loader2} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";

export default function AccountPage() {
  const {id} = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showExtract, setShowExtract] = useState(false);

  const {data: accountData, isLoading: isLoadingAccount} = useGetAccountById({
    accountId: id as string
  });

  const month = date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date();

  const {data: extractData, isLoading: isLoadingExtract} = useGetMonthlyAccountExtract({
    accountId: id as string
  }, {
    year: month.getFullYear(),
    month: month.getMonth() + 1
  }, {
    query: {
      enabled: showExtract
    }
  });

  if (isLoadingAccount) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin"/>
      </div>
    );
  }

  const account = accountData?.data as Account;
  const extract = extractData?.data;

  const handleGetExtract = () => {
    if (date) {
      setShowExtract(true);
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{account.name}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(account.createdAt!).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleGetExtract}
              disabled={!date || (showExtract && isLoadingExtract)}
            >
              {isLoadingExtract && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Get Monthly Extract
            </Button>
          </div>
        </div>
      </div>

      <AccountHeader account={account}/>

      {showExtract && extract && (
        <div className="space-y-8">
          <MonthlyExtractChart extract={extract}/>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                {format(new Date(extract.startDate!), "MMMM yyyy")} transactions
              </CardDescription>
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
                  {extract.transactions?.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      accounts={[account]}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}