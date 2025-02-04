import {Account, AccountStatus} from "@/http/generated";
import {formatCurrency} from "@/lib/utils";
import {Clock, CreditCard, User, Wallet} from "lucide-react";
import {MetricCard} from "@/components/dashboard/metric-card";

const getStatusColor = (status: AccountStatus) => {
  const colors = {
    Active: "text-green-500",
    Inactive: "text-red-500",
    Blocked: "text-yellow-500",
  };

  return colors[status];
};

export const AccountHeader = ({account}: { account: Account }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <MetricCard
      title="Balance"
      value={formatCurrency(account.balance?.amount || 0)}
      subtext="Current balance"
      icon={Wallet}
    />
    <MetricCard
      title="Daily Limit"
      value={formatCurrency(account.dailyLimit?.amount || 0)}
      subtext="Daily spending limit"
      icon={CreditCard}
    />
    <MetricCard
      title="Type"
      value={account.type!.toString()}
      icon={User}
    />
    <MetricCard
      title="Status"
      value={account.status!.toString()}
      icon={Clock}
      cn={getStatusColor(account.status!)}
    />
  </div>
);