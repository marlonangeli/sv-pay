import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult} from '@tanstack/react-query'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import type {
  GetAccountById400,
  GetAccountById404,
  GetAccountById500,
  GetAccountByIdPathParams,
  GetAccountByIdQueryResponse,
} from '@/http/generated'
import {getAccountById} from '@/http/generated'

export const getAccountByIdSuspenseQueryKey = ({accountId}: { accountId: GetAccountByIdPathParams['accountId'] }) =>
  [{url: '/api/v1/accounts/:accountId', params: {accountId: accountId}}] as const

export type GetAccountByIdSuspenseQueryKey = ReturnType<typeof getAccountByIdSuspenseQueryKey>

export function getAccountByIdSuspenseQueryOptions(
  {accountId}: { accountId: GetAccountByIdPathParams['accountId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getAccountByIdSuspenseQueryKey({accountId})
  return queryOptions<
    ResponseConfig<GetAccountByIdQueryResponse>,
    ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>,
    ResponseConfig<GetAccountByIdQueryResponse>,
    typeof queryKey
  >({
    enabled: !!accountId,
    queryKey,
    queryFn: async ({signal}) => {
      config.signal = signal
      return getAccountById({accountId}, config)
    },
  })
}

/**
 * @description Get account details by id
 * {@link /api/v1/accounts/:accountId}
 */
export function useGetAccountByIdSuspense<
  TData = ResponseConfig<GetAccountByIdQueryResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQueryData = ResponseConfig<GetAccountByIdQueryResponse>,
  TQueryKey extends QueryKey = GetAccountByIdSuspenseQueryKey,
>(
  {accountId}: { accountId: GetAccountByIdPathParams['accountId'] },
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<
        ResponseConfig<GetAccountByIdQueryResponse>,
        ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>,
        TData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAccountByIdSuspenseQueryKey({accountId})

  const query = useSuspenseQuery({
    ...(getAccountByIdSuspenseQueryOptions({accountId}, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}