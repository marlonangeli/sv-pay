import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  BlockAccount400,
  BlockAccount404,
  BlockAccount409,
  BlockAccount500,
  BlockAccountMutationRequest,
  BlockAccountMutationResponse,
} from '@/http/generated'
import {blockAccount} from '@/http/generated'

export const blockAccountMutationKey = () => [{url: '/api/v1/accounts/block'}] as const

export type BlockAccountMutationKey = ReturnType<typeof blockAccountMutationKey>

/**
 * @description Block or unblock an account
 * {@link /api/v1/accounts/block}
 */
export function useBlockAccount(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<BlockAccountMutationResponse>,
      ResponseErrorConfig<BlockAccount400 | BlockAccount404 | BlockAccount409 | BlockAccount500>,
      { data?: BlockAccountMutationRequest }
    >
    client?: Partial<RequestConfig<BlockAccountMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? blockAccountMutationKey()

  return useMutation<
    ResponseConfig<BlockAccountMutationResponse>,
    ResponseErrorConfig<BlockAccount400 | BlockAccount404 | BlockAccount409 | BlockAccount500>,
    { data?: BlockAccountMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return blockAccount(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}