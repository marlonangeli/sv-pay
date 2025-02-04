import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  ChangeDailyLimit400,
  ChangeDailyLimit404,
  ChangeDailyLimit409,
  ChangeDailyLimit500,
  ChangeDailyLimitMutationRequest,
  ChangeDailyLimitMutationResponse,
} from '@/http/generated'

export function getChangeDailyLimitUrl() {
  return `/api/v1/accounts/limit` as const
}

/**
 * @description Change daily limit of an account
 * {@link /api/v1/accounts/limit}
 */
export async function changeDailyLimit(
  data?: ChangeDailyLimitMutationRequest,
  config: Partial<RequestConfig<ChangeDailyLimitMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    ChangeDailyLimitMutationResponse,
    ResponseErrorConfig<ChangeDailyLimit400 | ChangeDailyLimit404 | ChangeDailyLimit409 | ChangeDailyLimit500>,
    ChangeDailyLimitMutationRequest
  >({method: 'PUT', url: getChangeDailyLimitUrl().toString(), data, ...requestConfig})
  return res
}