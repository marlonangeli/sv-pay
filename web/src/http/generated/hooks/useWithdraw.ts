import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  Withdraw400,
  Withdraw404,
  Withdraw409,
  Withdraw500,
  WithdrawMutationRequest,
  WithdrawMutationResponse
} from '@/http/generated'
import {withdraw} from '@/http/generated'

export const withdrawMutationKey = () => [{url: '/api/v1/transactions/withdraw'}] as const

export type WithdrawMutationKey = ReturnType<typeof withdrawMutationKey>

/**
 * @description Withdraw money from account
 * {@link /api/v1/transactions/withdraw}
 */
export function useWithdraw(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<WithdrawMutationResponse>,
      ResponseErrorConfig<Withdraw400 | Withdraw404 | Withdraw409 | Withdraw500>,
      { data?: WithdrawMutationRequest }
    >
    client?: Partial<RequestConfig<WithdrawMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? withdrawMutationKey()

  return useMutation<
    ResponseConfig<WithdrawMutationResponse>,
    ResponseErrorConfig<Withdraw400 | Withdraw404 | Withdraw409 | Withdraw500>,
    { data?: WithdrawMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return withdraw(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}