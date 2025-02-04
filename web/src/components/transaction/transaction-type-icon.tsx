import {TransactionType, transactionTypeEnum} from "@/http/generated";
import {ArrowDown, ArrowDownUp, ArrowUpRight} from "lucide-react";

export default function TransactionTypeIcon({ type }: { type: TransactionType }) {
  const icons = {
    [transactionTypeEnum.Deposit]: <ArrowUpRight className="h-5 w-5 text-green-500" />,
    [transactionTypeEnum.Withdraw]: <ArrowDown className="h-5 w-5 text-red-500" />,
    [transactionTypeEnum.Transfer]: <ArrowDownUp className="h-5 w-5 text-blue-500" />,
  }
  return icons[type] || null
}
