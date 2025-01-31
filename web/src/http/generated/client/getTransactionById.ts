import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  GetTransactionById404,
  GetTransactionById500,
  GetTransactionByIdPathParams,
  GetTransactionByIdQueryResponse,
} from '../models/GetTransactionById.ts'

export function getGetTransactionByIdUrl({transactionId}: {
  transactionId: GetTransactionByIdPathParams['transactionId']
}) {
  return `/api/v1/transactions/${transactionId}` as const
}

/**
 * @description Get transaction by id
 * {@link /api/v1/transactions/:transactionId}
 */
export async function getTransactionById(
  {transactionId}: { transactionId: GetTransactionByIdPathParams['transactionId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<GetTransactionByIdQueryResponse, ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>, unknown>({
    method: 'GET',
    url: getGetTransactionByIdUrl({transactionId}).toString(),
    ...requestConfig,
  })
  return res
}