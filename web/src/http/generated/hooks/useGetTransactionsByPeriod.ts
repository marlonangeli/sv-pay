import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, QueryObserverOptions, UseQueryResult} from '@tanstack/react-query'
import {queryOptions, useQuery} from '@tanstack/react-query'
import type {
  GetTransactionsByPeriod400,
  GetTransactionsByPeriod404,
  GetTransactionsByPeriod500,
  GetTransactionsByPeriodPathParams,
  GetTransactionsByPeriodQueryParams,
  GetTransactionsByPeriodQueryResponse,
} from '@/http/generated'
import {getTransactionsByPeriod} from '@/http/generated'

export const getTransactionsByPeriodQueryKey = (
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
) => [{
  url: '/api/v1/transactions/account/:accountId',
  params: {accountId: accountId}
}, ...(params ? [params] : [])] as const

export type GetTransactionsByPeriodQueryKey = ReturnType<typeof getTransactionsByPeriodQueryKey>

export function getTransactionsByPeriodQueryOptions(
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTransactionsByPeriodQueryKey({accountId}, params)
  return queryOptions<
    ResponseConfig<GetTransactionsByPeriodQueryResponse>,
    ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>,
    ResponseConfig<GetTransactionsByPeriodQueryResponse>,
    typeof queryKey
  >({
    enabled: !!(accountId && params),
    queryKey,
    queryFn: async ({signal}) => {
      config.signal = signal
      return getTransactionsByPeriod({accountId}, params, config)
    },
  })
}

/**
 * @description Get transactions for account
 * {@link /api/v1/transactions/account/:accountId}
 */
export function useGetTransactionsByPeriod<
  TData = ResponseConfig<GetTransactionsByPeriodQueryResponse>,
  TQueryData = ResponseConfig<GetTransactionsByPeriodQueryResponse>,
  TQueryKey extends QueryKey = GetTransactionsByPeriodQueryKey,
>(
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
  options: {
    query?: Partial<
      QueryObserverOptions<
        ResponseConfig<GetTransactionsByPeriodQueryResponse>,
        ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTransactionsByPeriodQueryKey({accountId}, params)

  const query = useQuery({
    ...(getTransactionsByPeriodQueryOptions({accountId}, params, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}