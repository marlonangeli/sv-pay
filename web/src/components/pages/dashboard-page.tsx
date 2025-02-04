"use client";

import {Button} from "@/components/ui/button";
import {accountStatusEnum, useGetUserById} from "@/http/generated";
import {useAccountsTransactions} from "@/hooks/use-accounts-transactions";
import {Activity, Loader2, Plus, Users, Wallet} from "lucide-react";
import Link from "next/link";
import {MetricCard} from "@/components/dashboard/metric-card";
import {AccountBalanceChart} from "@/components/account/account-balance-chart";
import {RecentTransactions} from "@/components/dashboard/recent-transactions";
import {formatCurrency} from "@/lib/utils";
import {AccountSummary} from "@/components/account/account-summary";

export default function DashboardPage({userId}: { userId: string }) {
  const {data: userData, isLoading: isLoadingUser} = useGetUserById(
    {userId},
    {query: {enabled: !!userId}}
  );

  const accounts = userData?.data.accounts || [];
  const {
    transactions: allTransactions,
    isLoading: isLoadingTransactions,
  } = useAccountsTransactions(accounts);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + (account.balance?.amount || 0),
    0
  );
  const activeAccounts = accounts.filter(
    (account) => account.status === accountStatusEnum.Active
  ).length;
  const dailyTransactions = allTransactions.filter(
    (tx) => new Date(tx.date!).toLocaleDateString() === new Date().toLocaleDateString()
  ).length;

  if (!userId) return <EmptyState/>;
  if (isLoadingUser || isLoadingTransactions) return <LoadingState/>;
  if (!accounts.length) return <EmptyState/>;

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your financial overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/transaction/new">
            <Button size="sm">New Transaction</Button>
          </Link>
          <Link href="/account/new">
            <Button size="sm">New Account</Button>
          </Link>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          subtext="Across all accounts"
          icon={Wallet}
        />
        <MetricCard
          title="Active Accounts"
          value={activeAccounts}
          subtext={`Out of ${accounts.length} total`}
          icon={Users}
        />
        <MetricCard
          title="Daily Transactions"
          value={dailyTransactions}
          subtext="Today's activity"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountSummary accounts={accounts}/>
        <AccountBalanceChart accounts={accounts}/>
      </div>

      <RecentTransactions transactions={allTransactions} accounts={accounts}/>
    </div>
  );
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <Wallet className="h-12 w-12 text-muted-foreground"/>
    <h2 className="mt-4 text-xl font-semibold">No Accounts Found</h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Get started by creating your first account
    </p>
    <Link href="/account/new" className="mt-6">
      <Button size="lg">
        <Plus className="mr-2 h-4 w-4"/>
        New Account
      </Button>
    </Link>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin"/>
  </div>
);
