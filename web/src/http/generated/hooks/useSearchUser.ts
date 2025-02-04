import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  SearchUser400,
  SearchUser404,
  SearchUser409,
  SearchUser500,
  SearchUserMutationRequest,
  SearchUserMutationResponse
} from '@/http/generated'
import {searchUser} from '@/http/generated'

export const searchUserMutationKey = () => [{url: '/api/v1/users/search'}] as const

export type SearchUserMutationKey = ReturnType<typeof searchUserMutationKey>

/**
 * @description Get user by email or CPF
 * {@link /api/v1/users/search}
 */
export function useSearchUser(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<SearchUserMutationResponse>,
      ResponseErrorConfig<SearchUser400 | SearchUser404 | SearchUser409 | SearchUser500>,
      { data?: SearchUserMutationRequest }
    >
    client?: Partial<RequestConfig<SearchUserMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? searchUserMutationKey()

  return useMutation<
    ResponseConfig<SearchUserMutationResponse>,
    ResponseErrorConfig<SearchUser400 | SearchUser404 | SearchUser409 | SearchUser500>,
    { data?: SearchUserMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return searchUser(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}