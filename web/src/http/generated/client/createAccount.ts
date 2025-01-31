import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  CreateAccount400,
  CreateAccount409,
  CreateAccount500,
  CreateAccountMutationRequest,
  CreateAccountMutationResponse,
} from '../models/CreateAccount.ts'

export function getCreateAccountUrl() {
  return `/api/v1/accounts` as const
}

/**
 * @description Create a new account
 * {@link /api/v1/accounts}
 */
export async function createAccount(
  data?: CreateAccountMutationRequest,
  config: Partial<RequestConfig<CreateAccountMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    CreateAccountMutationResponse,
    ResponseErrorConfig<CreateAccount400 | CreateAccount409 | CreateAccount500>,
    CreateAccountMutationRequest
  >({method: 'POST', url: getCreateAccountUrl().toString(), data, ...requestConfig})
  return res
}