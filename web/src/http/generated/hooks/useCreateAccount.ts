import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  CreateAccount400,
  CreateAccount409,
  CreateAccount500,
  CreateAccountMutationRequest,
  CreateAccountMutationResponse,
} from '@/http/generated'
import {createAccount} from '@/http/generated'

export const createAccountMutationKey = () => [{url: '/api/v1/accounts'}] as const

export type CreateAccountMutationKey = ReturnType<typeof createAccountMutationKey>

/**
 * @description Create a new account
 * {@link /api/v1/accounts}
 */
export function useCreateAccount(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<CreateAccountMutationResponse>,
      ResponseErrorConfig<CreateAccount400 | CreateAccount409 | CreateAccount500>,
      { data?: CreateAccountMutationRequest }
    >
    client?: Partial<RequestConfig<CreateAccountMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createAccountMutationKey()

  return useMutation<
    ResponseConfig<CreateAccountMutationResponse>,
    ResponseErrorConfig<CreateAccount400 | CreateAccount409 | CreateAccount500>,
    { data?: CreateAccountMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return createAccount(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}