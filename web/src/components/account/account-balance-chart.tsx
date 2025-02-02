import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import { Account } from "@/http/generated";

interface AccountBalanceChartProps {
  accounts: Account[];
}

export const AccountBalanceChart = ({ accounts }: AccountBalanceChartProps) => {
  const chartData = accounts.map((account) => ({
    name: account.name,
    value: account.balance?.amount || 0,
    fill: `hsl(var(--chart-${(accounts.indexOf(account) % 5) + 1}))`,
  }));

  const chartConfig = accounts.reduce((config, account, index) => {
    return {
      ...config,
      [account.id!]: {
        label: account.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    };
  }, {
    value: { label: "Balance" },
  }) as ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Balance Distribution</CardTitle>
        <CardDescription>Account balance breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="value" nameKey="name" label />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {accounts.length} Accounts
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total balance across all accounts
        </div>
      </CardFooter>
    </Card>
  );
};

