// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import {Account, AccountStatus, accountStatusEnum} from "@/http/generated";
// import { formatCurrency } from "@/lib/utils";
//
// const getStatusBadge = (status: AccountStatus) => {
//   return (
//     <Badge variant={
//       status === accountStatusEnum.Active ? "default" :
//         status === accountStatusEnum.Inactive ? "secondary" : "destructive"
//     }>{status}</Badge>
//   );
// };
//
// export const AccountHeader = ({ account }: { account: Account }) => (
//   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm text-muted-foreground">Balance</p>
//           <p className="text-2xl font-bold">{formatCurrency(account.balance?.amount || 0)}</p>
//         </div>
//       </CardContent>
//     </Card>
//
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm text-muted-foreground">Daily Limit</p>
//           <p className="text-2xl font-bold">{formatCurrency(account.dailyLimit?.amount || 0)}</p>
//         </div>
//       </CardContent>
//     </Card>
//
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm text-muted-foreground">Account Type</p>
//           <div className="flex items-center gap-2">
//             <p className="text-2xl font-bold">{account.type}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex flex-col gap-1">
//           <p className="text-sm text-muted-foreground">Status</p>
//           <div className="flex items-center gap-2">
//             {getStatusBadge(account.status!)}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// );

import {Account, AccountStatus} from "@/http/generated";
import {formatCurrency} from "@/lib/utils";
import {Clock, CreditCard, User, Wallet} from "lucide-react";
import {MetricCard} from "@/components/dashboard/metric-card.tsx";

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