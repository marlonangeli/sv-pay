import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  BlockAccount400,
  BlockAccount404,
  BlockAccount409,
  BlockAccount500,
  BlockAccountMutationRequest,
  BlockAccountMutationResponse,
} from '../models/BlockAccount.ts'

export function getBlockAccountUrl() {
  return `/api/v1/accounts/block` as const
}

/**
 * @description Block or unblock an account
 * {@link /api/v1/accounts/block}
 */
export async function blockAccount(
  data?: BlockAccountMutationRequest,
  config: Partial<RequestConfig<BlockAccountMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    BlockAccountMutationResponse,
    ResponseErrorConfig<BlockAccount400 | BlockAccount404 | BlockAccount409 | BlockAccount500>,
    BlockAccountMutationRequest
  >({method: 'PUT', url: getBlockAccountUrl().toString(), data, ...requestConfig})
  return res
}