import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  Transfer400,
  Transfer404,
  Transfer409,
  Transfer500,
  TransferMutationRequest,
  TransferMutationResponse
} from '../models/Transfer.ts'
import {transfer} from '../client/transfer.ts'

export const transferMutationKey = () => [{url: '/api/v1/transactions/transfer'}] as const

export type TransferMutationKey = ReturnType<typeof transferMutationKey>

/**
 * @description Transfer money between accounts
 * {@link /api/v1/transactions/transfer}
 */
export function useTransfer(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<TransferMutationResponse>,
      ResponseErrorConfig<Transfer400 | Transfer404 | Transfer409 | Transfer500>,
      { data?: TransferMutationRequest }
    >
    client?: Partial<RequestConfig<TransferMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? transferMutationKey()

  return useMutation<
    ResponseConfig<TransferMutationResponse>,
    ResponseErrorConfig<Transfer400 | Transfer404 | Transfer409 | Transfer500>,
    { data?: TransferMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return transfer(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}