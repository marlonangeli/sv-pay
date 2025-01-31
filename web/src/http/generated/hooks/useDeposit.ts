import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  Deposit400,
  Deposit404,
  Deposit409,
  Deposit500,
  DepositMutationRequest,
  DepositMutationResponse
} from '../models/Deposit.ts'
import {deposit} from '../client/deposit.ts'

export const depositMutationKey = () => [{url: '/api/v1/transactions/deposit'}] as const

export type DepositMutationKey = ReturnType<typeof depositMutationKey>

/**
 * @description Deposit money to account
 * {@link /api/v1/transactions/deposit}
 */
export function useDeposit(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<DepositMutationResponse>,
      ResponseErrorConfig<Deposit400 | Deposit404 | Deposit409 | Deposit500>,
      { data?: DepositMutationRequest }
    >
    client?: Partial<RequestConfig<DepositMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? depositMutationKey()

  return useMutation<
    ResponseConfig<DepositMutationResponse>,
    ResponseErrorConfig<Deposit400 | Deposit404 | Deposit409 | Deposit500>,
    { data?: DepositMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return deposit(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}