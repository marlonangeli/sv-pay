import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  InactiveAccount400,
  InactiveAccount404,
  InactiveAccount409,
  InactiveAccount500,
  InactiveAccountMutationRequest,
  InactiveAccountMutationResponse,
} from '@/http/generated'
import {inactiveAccount} from '@/http/generated'

export const inactiveAccountMutationKey = () => [{url: '/api/v1/accounts/inactive'}] as const

export type InactiveAccountMutationKey = ReturnType<typeof inactiveAccountMutationKey>

/**
 * @description Inactive or active an account
 * {@link /api/v1/accounts/inactive}
 */
export function useInactiveAccount(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<InactiveAccountMutationResponse>,
      ResponseErrorConfig<InactiveAccount400 | InactiveAccount404 | InactiveAccount409 | InactiveAccount500>,
      { data?: InactiveAccountMutationRequest }
    >
    client?: Partial<RequestConfig<InactiveAccountMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? inactiveAccountMutationKey()

  return useMutation<
    ResponseConfig<InactiveAccountMutationResponse>,
    ResponseErrorConfig<InactiveAccount400 | InactiveAccount404 | InactiveAccount409 | InactiveAccount500>,
    { data?: InactiveAccountMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return inactiveAccount(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}