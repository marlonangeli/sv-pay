import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult} from '@tanstack/react-query'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import type {
  GetTransactionsByPeriod400,
  GetTransactionsByPeriod404,
  GetTransactionsByPeriod500,
  GetTransactionsByPeriodPathParams,
  GetTransactionsByPeriodQueryParams,
  GetTransactionsByPeriodQueryResponse,
} from '@/http/generated'
import {getTransactionsByPeriod} from '@/http/generated'

export const getTransactionsByPeriodSuspenseQueryKey = (
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
) => [{
  url: '/api/v1/transactions/account/:accountId',
  params: {accountId: accountId}
}, ...(params ? [params] : [])] as const

export type GetTransactionsByPeriodSuspenseQueryKey = ReturnType<typeof getTransactionsByPeriodSuspenseQueryKey>

export function getTransactionsByPeriodSuspenseQueryOptions(
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTransactionsByPeriodSuspenseQueryKey({accountId}, params)
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
export function useGetTransactionsByPeriodSuspense<
  TData = ResponseConfig<GetTransactionsByPeriodQueryResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQueryData = ResponseConfig<GetTransactionsByPeriodQueryResponse>,
  TQueryKey extends QueryKey = GetTransactionsByPeriodSuspenseQueryKey,
>(
  {accountId}: { accountId: GetTransactionsByPeriodPathParams['accountId'] },
  params: GetTransactionsByPeriodQueryParams,
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<
        ResponseConfig<GetTransactionsByPeriodQueryResponse>,
        ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>,
        TData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTransactionsByPeriodSuspenseQueryKey({accountId}, params)

  const query = useSuspenseQuery({
    ...(getTransactionsByPeriodSuspenseQueryOptions({accountId}, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}