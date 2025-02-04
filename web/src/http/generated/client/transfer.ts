import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  Transfer400,
  Transfer404,
  Transfer409,
  Transfer500,
  TransferMutationRequest,
  TransferMutationResponse
} from '@/http/generated'

export function getTransferUrl() {
  return `/api/v1/transactions/transfer` as const
}

/**
 * @description Transfer money between accounts
 * {@link /api/v1/transactions/transfer}
 */
export async function transfer(data?: TransferMutationRequest, config: Partial<RequestConfig<TransferMutationRequest>> & {
  client?: typeof client
} = {}) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<TransferMutationResponse, ResponseErrorConfig<Transfer400 | Transfer404 | Transfer409 | Transfer500>, TransferMutationRequest>({
    method: 'POST',
    url: getTransferUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}