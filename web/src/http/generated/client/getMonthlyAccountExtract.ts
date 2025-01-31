import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  GetMonthlyAccountExtract400,
  GetMonthlyAccountExtract404,
  GetMonthlyAccountExtract409,
  GetMonthlyAccountExtract500,
  GetMonthlyAccountExtractPathParams,
  GetMonthlyAccountExtractQueryParams,
  GetMonthlyAccountExtractQueryResponse,
} from '../models/GetMonthlyAccountExtract.ts'

export function getGetMonthlyAccountExtractUrl({accountId}: {
  accountId: GetMonthlyAccountExtractPathParams['accountId']
}) {
  return `/api/v1/accounts/${accountId}/extract` as const
}

/**
 * @description Get monthly extract of an account
 * {@link /api/v1/accounts/:accountId/extract}
 */
export async function getMonthlyAccountExtract(
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    GetMonthlyAccountExtractQueryResponse,
    ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>,
    unknown
  >({method: 'GET', url: getGetMonthlyAccountExtractUrl({accountId}).toString(), params, ...requestConfig})
  return res
}