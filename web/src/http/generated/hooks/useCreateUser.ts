import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {UseMutationOptions} from '@tanstack/react-query'
import {useMutation} from '@tanstack/react-query'
import type {
  CreateUser400,
  CreateUser404,
  CreateUser409,
  CreateUser500,
  CreateUserMutationRequest,
  CreateUserMutationResponse
} from '../models/CreateUser.ts'
import {createUser} from '../client/createUser.ts'

export const createUserMutationKey = () => [{url: '/api/v1/users'}] as const

export type CreateUserMutationKey = ReturnType<typeof createUserMutationKey>

/**
 * @description Create a new user
 * {@link /api/v1/users}
 */
export function useCreateUser(
  options: {
    mutation?: UseMutationOptions<
      ResponseConfig<CreateUserMutationResponse>,
      ResponseErrorConfig<CreateUser400 | CreateUser404 | CreateUser409 | CreateUser500>,
      { data?: CreateUserMutationRequest }
    >
    client?: Partial<RequestConfig<CreateUserMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const {mutation: mutationOptions, client: config = {}} = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createUserMutationKey()

  return useMutation<
    ResponseConfig<CreateUserMutationResponse>,
    ResponseErrorConfig<CreateUser400 | CreateUser404 | CreateUser409 | CreateUser500>,
    { data?: CreateUserMutationRequest }
  >({
    mutationFn: async ({data}) => {
      return createUser(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}