import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Account, accountStatusEnum } from "@/http/generated";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge.tsx";
import Link from "next/link";

interface AccountSummaryProps {
  accounts: Account[];
}

export const AccountSummary = ({ accounts }: AccountSummaryProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Account Summary</CardTitle>
      <CardDescription>Balance distribution across accounts</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div key={account.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 bg-chart-${(index % 5) + 1}`} />
                  <Link href={`/account/${account.id}`} className="text-sm font-medium hover:underline">
                    {account.name}
                  </Link>
                  {account.status !== accountStatusEnum.Active && (
                    <Badge className="ml-2" variant="destructive">{account.status}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground pl-5">{account.type}</p>
              </div>
              <div className="font-medium">{formatCurrency(account.balance?.amount || 0)}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);
