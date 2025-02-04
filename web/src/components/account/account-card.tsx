import React from 'react'
import {cn, formatCurrency} from "@/lib/utils"
import {Account, accountStatusEnum} from "@/http/generated"
import {Badge} from "@/components/ui/badge"
import {motion} from "framer-motion"

type AccountCardProps = {
  account: Account
  onClick: () => void
  selected: boolean
  showBalance: boolean
}

export const AccountCard = ({account, onClick, selected, showBalance}: AccountCardProps) => {
  const isInactive = account.status !== accountStatusEnum.Active

  return (
    <motion.div
      initial={{opacity: 0, scale: 0.95}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 0.2}}
      onClick={isInactive ? undefined : onClick}
      className={cn(
        "border p-4 rounded-lg transition-all relative",
        isInactive
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:border-primary/50 hover:shadow-md",
        selected ? "border-primary shadow-lg" : "border-muted-foreground/30"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className={cn("font-medium", isInactive && "line-through text-muted-foreground")}>
            {account.name}
          </h3>
          <Badge variant="secondary" className="text-xs">{account.type}</Badge>
        </div>
        {isInactive && <Badge variant="destructive">{account.status}</Badge>}
      </div>
      {isInactive && <div className="absolute inset-0 bg-white/70"></div>}
      {showBalance && (
        <div className="mt-2">
          <p className={cn("text-lg font-semibold", isInactive && "text-muted-foreground")}>
            {formatCurrency(account.balance?.amount ?? 0)}
          </p>
        </div>
      )}
    </motion.div>
  )
}
