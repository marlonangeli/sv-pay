import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  ChangeDailyLimit400,
  ChangeDailyLimit404,
  ChangeDailyLimit409,
  ChangeDailyLimit500,
  ChangeDailyLimitMutationRequest,
  ChangeDailyLimitMutationResponse,
} from '../models/ChangeDailyLimit.ts'
import {changeDailyLimit} from '../client/changeDailyLimit.ts'

export const changeDailyLimitMutationKey = () => [{url: '/api/v1/accounts/limit'}] as const

export type ChangeDailyLimitMutationKey = ReturnType<typeof changeDailyLimitMutationKey>

/**
 * @description Change daily limit of an account
 * {@link /api/v1/accounts/limit}
 */
export function useChangeDailyLimit(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<ChangeDailyLimitMutationResponse>,
      ResponseErrorConfig<ChangeDailyLimit400 | ChangeDailyLimit404 | ChangeDailyLimit409 | ChangeDailyLimit500>,
      { data?: ChangeDailyLimitMutationRequest }
    >
    client?: Partial<RequestConfig<ChangeDailyLimitMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? changeDailyLimitMutationKey()

  return useMutation<
    ResponseConfig<ChangeDailyLimitMutationResponse>,
    ResponseErrorConfig<ChangeDailyLimit400 | ChangeDailyLimit404 | ChangeDailyLimit409 | ChangeDailyLimit500>,
    { data?: ChangeDailyLimitMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return changeDailyLimit(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}