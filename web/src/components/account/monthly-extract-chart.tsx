import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyAccountExtract } from "@/http/generated";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const MonthlyExtractChart = ({ extract }: { extract: MonthlyAccountExtract }) => {
  const chartData = [
    {
      category: "Income",
      amount: extract.totalIncome?.amount || 0,
    },
    {
      category: "Outcome",
      amount: Math.abs(extract.totalOutcome?.amount || 0),
    }
  ];

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const percentageChange = ((extract.finalBalance?.amount || 0) - (extract.initialBalance?.amount || 0)) /
    (extract.initialBalance?.amount || 1) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Movement</CardTitle>
        <CardDescription>
          {new Date(extract.startDate!).toLocaleDateString()} - {new Date(extract.endDate!).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => formatCurrency(value as number)}
              />}
            />
            <Bar dataKey="amount" fill="var(--chart-2)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {percentageChange >= 0 ? "Up" : "Down"} by {Math.abs(percentageChange).toFixed(1)}% this month
          <TrendingUp className={`h-4 w-4 ${percentageChange >= 0 ? "text-green-500" : "text-red-500"}`} />
        </div>
        <div className="leading-none text-muted-foreground">
          Initial Balance: {formatCurrency(extract.initialBalance?.amount || 0)} •
          Final Balance: {formatCurrency(extract.finalBalance?.amount || 0)}
        </div>
      </CardFooter>
    </Card>
  );
};
