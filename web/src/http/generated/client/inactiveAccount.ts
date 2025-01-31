import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  InactiveAccount400,
  InactiveAccount404,
  InactiveAccount409,
  InactiveAccount500,
  InactiveAccountMutationRequest,
  InactiveAccountMutationResponse,
} from '../models/InactiveAccount.ts'

export function getInactiveAccountUrl() {
  return `/api/v1/accounts/inactive` as const
}

/**
 * @description Inactive or active an account
 * {@link /api/v1/accounts/inactive}
 */
export async function inactiveAccount(
  data?: InactiveAccountMutationRequest,
  config: Partial<RequestConfig<InactiveAccountMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    InactiveAccountMutationResponse,
    ResponseErrorConfig<InactiveAccount400 | InactiveAccount404 | InactiveAccount409 | InactiveAccount500>,
    InactiveAccountMutationRequest
  >({method: 'PUT', url: getInactiveAccountUrl().toString(), data, ...requestConfig})
  return res
}