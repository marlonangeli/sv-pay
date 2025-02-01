import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";
import {cn} from "@/lib/utils.ts";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  cn?: string;
}

export const MetricCard = ({ title, value, subtext, icon: Icon, cn: className }: MetricCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold", className)}>{value}</div>
      {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
    </CardContent>
  </Card>
);
