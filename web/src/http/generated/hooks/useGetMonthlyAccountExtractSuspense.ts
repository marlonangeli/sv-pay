import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult} from '@tanstack/react-query'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import type {
  GetMonthlyAccountExtract400,
  GetMonthlyAccountExtract404,
  GetMonthlyAccountExtract409,
  GetMonthlyAccountExtract500,
  GetMonthlyAccountExtractPathParams,
  GetMonthlyAccountExtractQueryParams,
  GetMonthlyAccountExtractQueryResponse,
} from '@/http/generated'
import {getMonthlyAccountExtract} from '@/http/generated'

export const getMonthlyAccountExtractSuspenseQueryKey = (
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
) => [{
  url: '/api/v1/accounts/:accountId/extract',
  params: {accountId: accountId}
}, ...(params ? [params] : [])] as const

export type GetMonthlyAccountExtractSuspenseQueryKey = ReturnType<typeof getMonthlyAccountExtractSuspenseQueryKey>

export function getMonthlyAccountExtractSuspenseQueryOptions(
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getMonthlyAccountExtractSuspenseQueryKey({accountId}, params)
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
export function useGetMonthlyAccountExtractSuspense<
  TData = ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQueryData = ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
  TQueryKey extends QueryKey = GetMonthlyAccountExtractSuspenseQueryKey,
>(
  {accountId}: { accountId: GetMonthlyAccountExtractPathParams['accountId'] },
  params: GetMonthlyAccountExtractQueryParams,
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<
        ResponseConfig<GetMonthlyAccountExtractQueryResponse>,
        ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>,
        TData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getMonthlyAccountExtractSuspenseQueryKey({accountId}, params)

  const query = useSuspenseQuery({
    ...(getMonthlyAccountExtractSuspenseQueryOptions({accountId}, params, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<
    TData,
    ResponseErrorConfig<GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500>
  > & { queryKey: TQueryKey }

  query.queryKey = queryKey as TQueryKey

  return query
}