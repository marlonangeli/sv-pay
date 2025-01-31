import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  GetTransactionsByPeriod400,
  GetTransactionsByPeriod404,
  GetTransactionsByPeriod500,
  GetTransactionsByPeriodPathParams,
  GetTransactionsByPeriodQueryParams,
  GetTransactionsByPeriodQueryResponse,
} from '../models/GetTransactionsByPeriod.ts'

export function getGetTransactionsByPeriodUrl({accountId}: {
  accountId: GetTransactionsByPeriodPathParams['accountId']
}) {
  return `/api/v1/transactions/account/${accountId}` as const
}

/**
 * @description Get transactions for account
 * {@link /api/v1/transactions/account/:accountId}
 */
export async function getTransactionsByPeriod(
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    GetTransactionsByPeriodQueryResponse,
    ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>,
    unknown
  >({method: 'GET', url: getGetTransactionsByPeriodUrl({accountId}).toString(), params, ...requestConfig})
  return res
}