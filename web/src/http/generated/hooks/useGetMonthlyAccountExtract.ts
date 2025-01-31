import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, QueryObserverOptions, UseQueryResult} from '@tanstack/react-query'
import {queryOptions, useQuery} from '@tanstack/react-query'
import type {
  GetMonthlyAccountExtract400,
  GetMonthlyAccountExtract404,
  GetMonthlyAccountExtract409,
  GetMonthlyAccountExtract500,
  GetMonthlyAccountExtractPathParams,
  GetMonthlyAccountExtractQueryParams,
  GetMonthlyAccountExtractQueryResponse,
} from '../models/GetMonthlyAccountExtract.ts'
import {getMonthlyAccountExtract} from '../client/getMonthlyAccountExtract.ts'

export const getMonthlyAccountExtractQueryKey = (
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
) => [{
  url: '/api/v1/accounts/:accountId/extract',
  params: {accountId: accountId}
}, ...(params ? [params] : [])] as const

export type GetMonthlyAccountExtractQueryKey = ReturnType<typeof getMonthlyAccountExtractQueryKey>

export function getMonthlyAccountExtractQueryOptions(
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getMonthlyAccountExtractQueryKey({accountId}, params)
  return queryOptions<
    ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
    ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>,
    ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
    typeof queryKey
  >({
    enabled: !!(accountId && params),
    queryKey,
    queryFn: async ({signal}) => {
      config.signal = signal
      return getMonthlyAccountExtract({accountId}, params, config)
    },
  })
}

/**
 * @description Get monthly extract of an account
 * {@link /api/v1/accounts/:accountId/extract}
 */
export function useGetMonthlyAccountExtract<
  TData = ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
  TQueryData = ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
  TQueryKey extends QueryKey = GetMonthlyAccountExtractQueryKey,
>(
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
  options: {
    query?: Partial<
      QueryObserverOptions<
        ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
        ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMonthlyAccountExtractQueryKey({accountId}, params)

  const query = useQuery({
    ...(getMonthlyAccountExtractQueryOptions({accountId}, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<
    TData,
    ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>
  > & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}