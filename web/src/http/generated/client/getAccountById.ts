import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  GetAccountById400,
  GetAccountById404,
  GetAccountById500,
  GetAccountByIdPathParams,
  GetAccountByIdQueryResponse,
} from '@/http/generated'

export function getGetAccountByIdUrl({accountId}: { accountId: GetAccountByIdPathParams['accountId'] }) {
  return `/api/v1/accounts/${accountId}` as const
}

/**
 * @description Get account details by id
 * {@link /api/v1/accounts/:accountId}
 */
export async function getAccountById(
  {accountId}: { accountId: GetAccountByIdPathParams['accountId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<GetAccountByIdQueryResponse, ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>, unknown>({
    method: 'GET',
    url: getGetAccountByIdUrl({accountId}).toString(),
    ...requestConfig,
  })
  return res
}