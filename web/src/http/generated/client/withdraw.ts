import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  Withdraw400,
  Withdraw404,
  Withdraw409,
  Withdraw500,
  WithdrawMutationRequest,
  WithdrawMutationResponse
} from '@/http/generated'

export function getWithdrawUrl() {
  return `/api/v1/transactions/withdraw` as const
}

/**
 * @description Withdraw money from account
 * {@link /api/v1/transactions/withdraw}
 */
export async function withdraw(data?: WithdrawMutationRequest, config: Partial<RequestConfig<WithdrawMutationRequest>> & {
  client?: typeof client
} = {}) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<WithdrawMutationResponse, ResponseErrorConfig<Withdraw400 | Withdraw404 | Withdraw409 | Withdraw500>, WithdrawMutationRequest>({
    method: 'POST',
    url: getWithdrawUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}