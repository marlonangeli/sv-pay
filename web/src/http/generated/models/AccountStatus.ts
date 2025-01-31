export const accountStatusEnum = {
  Active: 'Active',
  Inactive: 'Inactive',
  Blocked: 'Blocked',
} as const

export type AccountStatusEnum = (typeof accountStatusEnum)[keyof typeof accountStatusEnum]

export type AccountStatus = AccountStatusEnum