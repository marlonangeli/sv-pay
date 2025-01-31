export const getUserRequestTypeEnum = {
  Email: 'Email',
  CPF: 'CPF',
} as const

export type GetUserRequestTypeEnum = (typeof getUserRequestTypeEnum)[keyof typeof getUserRequestTypeEnum]

export type GetUserRequestType = GetUserRequestTypeEnum