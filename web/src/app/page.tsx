'use client'

import React from 'react';
import { AccountSummary } from '@/components/account/account-summary';
import { AccountBalanceChart } from '@/components/account/account-balance-chart';
import { Account } from '@/http/generated';
import AppHeader from "@/components/app-header.tsx";

const SVPayLanding = () => {
  const fakeAccounts = [
    {
      id: '1',
      name: 'Main Account',
      type: 'Digital',
      status: 'Active',
      balance: { amount: 4800 },
    },
    {
      id: '2',
      name: 'Savings',
      type: 'Digital',
      status: 'Inactive',
      balance: { amount: 600 },
    },
    {
      id: '3',
      name: 'Investment',
      type: 'Investment',
      status: 'Active',
      balance: { amount: 7300 },
    }
  ] as Account[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-24 flex-grow mt-6">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Simplify Your Payment Management
          </h2>
          <p className="text-lg text-muted-foreground">
            Streamline your financial operations with our comprehensive payment management system.
            Track accounts, monitor transactions, and manage users all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <section className="flex flex-col justify-center">
            <SectionHeader
              title="Account Balance Distribution"
              description="Visualize how your funds are distributed across different accounts. Our intuitive chart helps you understand your financial portfolio at a glance, making it easier to maintain a balanced financial strategy."
            />
          </section>
          <section>
            <div className="bg-card rounded-xl p-6 shadow-sm h-[400px]">
              <AccountBalanceChart accounts={fakeAccounts} />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <section>
            <div className="bg-card rounded-xl p-6 shadow-sm h-[400px] pointer-events-none">
              <AccountSummary accounts={fakeAccounts} />
            </div>
          </section>
          <section className="flex flex-col justify-center">
            <SectionHeader
              title="Account Summary"
              description="Get a comprehensive overview of all your accounts in one place. Track balances, monitor account status, and manage your financial assets effectively with our detailed summary view."
            />
          </section>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2025 SV Pay | <a href="https://github.com/marlonangeli/sv-pay" className="text-blue-500 hover:underline">GitHub</a>
      </footer>
    </div>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6 space-y-4">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default SVPayLanding;
