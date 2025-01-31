export const transactionTypeEnum = {
  Deposit: 'Deposit',
  Withdraw: 'Withdraw',
  Transfer: 'Transfer',
} as const

export type TransactionTypeEnum = (typeof transactionTypeEnum)[keyof typeof transactionTypeEnum]

export type TransactionType = TransactionTypeEnum