export const accountTypeEnum = {
  Digital: 'Digital',
  Investment: 'Investment',
} as const

export type AccountTypeEnum = (typeof accountTypeEnum)[keyof typeof accountTypeEnum]

export type AccountType = AccountTypeEnum