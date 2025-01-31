import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  CreateUser400,
  CreateUser404,
  CreateUser409,
  CreateUser500,
  CreateUserMutationRequest,
  CreateUserMutationResponse
} from '../models/CreateUser.ts'

export function getCreateUserUrl() {
  return `/api/v1/users` as const
}

/**
 * @description Create a new user
 * {@link /api/v1/users}
 */
export async function createUser(
  data?: CreateUserMutationRequest,
  config: Partial<RequestConfig<CreateUserMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    CreateUserMutationResponse,
    ResponseErrorConfig<CreateUser400 | CreateUser404 | CreateUser409 | CreateUser500>,
    CreateUserMutationRequest
  >({method: 'POST', url: getCreateUserUrl().toString(), data, ...requestConfig})
  return res
}