import {Banknote} from "lucide-react";

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg ring-2 ring-purple-200">
      <Banknote className="size-6" />
    </div>
    <div className="grid flex-1 text-left leading-tight">
      <span className="text-xl font-bold tracking-tight">SV Pay</span>
      <span className="text-sm text-muted-foreground">Smart Payment Solutions</span>
    </div>
  </div>
);