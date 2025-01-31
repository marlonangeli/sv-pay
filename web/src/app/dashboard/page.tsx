'use client'

import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowDownUp, ArrowUpRight, Loader2, Plus} from "lucide-react";
import Link from "next/link";
import {formatCurrency} from "@/lib/utils";
import {accountStatusEnum, transactionTypeEnum, useGetUserById} from "@/http/generated";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useAccountsTransactions} from "@/hooks/use-accounts-transactions.tsx";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <h2 className="mt-2 text-xl font-semibold">No Accounts Found</h2>
    <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first account</p>
    <Link href="/accounts/new" className="mt-4">
      <Button>
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

export default function DashboardPage() {
  const userId = localStorage.getItem("userId");
  const {data: userData, isLoading: isLoadingUser} = useGetUserById({
    userId: userId || ''
  }, {
    query: {
      enabled: !!userId
    }
  });

  const accounts = userData?.data.accounts || [];
  const {
    transactions: allTransactions,
    isLoading: isLoadingTransactions
  } = useAccountsTransactions(accounts);


  const totalBalance = accounts.reduce((sum, account) => sum + (account.balance?.amount || 0), 0);
  const activeAccounts = accounts.filter(account => account.status === accountStatusEnum.Active).length;
  const dailyTransactions = allTransactions.filter(
    tx => new Date(tx.date!).toDateString() === new Date().toDateString()
  ).length;

  if (!userId) {
    return <EmptyState/>;
  }

  if (isLoadingUser || isLoadingTransactions) {
    return <LoadingState/>;
  }

  if (!accounts.length) {
    return <EmptyState/>;
  }

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/accounts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4"/>
            New Account
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts}</div>
            <p className="text-xs text-muted-foreground">Out of {accounts.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyTransactions}</div>
            <p className="text-xs text-muted-foreground">Today&apos;s activity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>All accounts overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {account.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.type} Account
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {formatCurrency(account.balance?.amount || 0)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.slice(0, 10).map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date!).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {transaction.type === transactionTypeEnum.Deposit ? (
                        <ArrowUpRight className="mr-2 h-4 w-4 text-green-500"/>
                      ) : (
                        <ArrowDownUp className="mr-2 h-4 w-4 text-red-500"/>
                      )}
                      {transaction.type === transactionTypeEnum.Deposit ? 'Deposit' : 'Transfer'}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right ${
                    transaction.type === transactionTypeEnum.Deposit ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(transaction.amount?.amount || 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
