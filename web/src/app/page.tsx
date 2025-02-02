'use client'

import React from 'react';
import {Button} from '@/components/ui/button';
import {UserPlus} from 'lucide-react';
import {AccountSummary} from '@/components/account/account-summary';
import {AccountBalanceChart} from '@/components/account/account-balance-chart';
import {Account} from '@/http/generated';
import {SearchUserForm} from "@/components/user/search-user-form.tsx";
import {Logo} from "@/components/logo.tsx";

const SVPayLanding = () => {
  const fakeAccounts = [
    {
      id: '1',
      name: 'Main Account',
      type: 'Investment',
      status: 'Active',
      balance: {amount: 5000},
    },
    {
      id: '2',
      name: 'Savings',
      type: 'Digital',
      status: 'Inactive',
      balance: {amount: 600},
    },
    {
      id: '3',
      name: 'Investment',
      type: 'Digital',
      status: 'Active',
      balance: {amount: 2300},
    }
  ] as Account[];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo/>
          <div className="flex gap-4">
            <SearchUserForm/>
            <Button>
              <UserPlus className="mr-2 h-4 w-4"/>
              Create User
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
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
          <section>
            <SectionHeader
              title="Account Balance Distribution"
              description="Visualize how your funds are distributed across different accounts. Our intuitive chart helps you understand your financial portfolio at a glance, making it easier to maintain a balanced financial strategy."
            />
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <AccountBalanceChart accounts={fakeAccounts}/>
            </div>
          </section>

          <section>
            <SectionHeader
              title="Account Summary"
              description="Get a comprehensive overview of all your accounts in one place. Track balances, monitor account status, and manage your financial assets effectively with our detailed summary view."
            />
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <AccountSummary accounts={fakeAccounts}/>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default SVPayLanding;