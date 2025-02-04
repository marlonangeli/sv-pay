import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  Deposit400,
  Deposit404,
  Deposit409,
  Deposit500,
  DepositMutationRequest,
  DepositMutationResponse
} from '@/http/generated'

export function getDepositUrl() {
  return `/api/v1/transactions/deposit` as const
}

/**
 * @description Deposit money to account
 * {@link /api/v1/transactions/deposit}
 */
export async function deposit(data?: DepositMutationRequest, config: Partial<RequestConfig<DepositMutationRequest>> & {
  client?: typeof client
} = {}) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<DepositMutationResponse, ResponseErrorConfig<Deposit400 | Deposit404 | Deposit409 | Deposit500>, DepositMutationRequest>({
    method: 'POST',
    url: getDepositUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}