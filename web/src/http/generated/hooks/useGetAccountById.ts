import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, QueryObserverOptions, UseQueryResult} from '@tanstack/react-query'
import {queryOptions, useQuery} from '@tanstack/react-query'
import type {
  GetAccountById400,
  GetAccountById404,
  GetAccountById500,
  GetAccountByIdPathParams,
  GetAccountByIdQueryResponse,
} from '../models/GetAccountById.ts'
import {getAccountById} from '../client/getAccountById.ts'

export const getAccountByIdQueryKey = ({accountId}: { accountId: GetAccountByIdPathParams['accountId'] }) =>
  [{url: '/api/v1/accounts/:accountId', params: {accountId: accountId}}] as const

export type GetAccountByIdQueryKey = ReturnType<typeof getAccountByIdQueryKey>

export function getAccountByIdQueryOptions(
  {accountId}: { accountId: GetAccountByIdPathParams['accountId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getAccountByIdQueryKey({accountId})
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
export function useGetAccountById<
  TData = ResponseConfig<GetAccountByIdQueryResponse>,
  TQueryData = ResponseConfig<GetAccountByIdQueryResponse>,
  TQueryKey extends QueryKey = GetAccountByIdQueryKey,
>(
  {accountId}: { accountId: GetAccountByIdPathParams['accountId'] },
  options: {
    query?: Partial<
      QueryObserverOptions<
        ResponseConfig<GetAccountByIdQueryResponse>,
        ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getAccountByIdQueryKey({accountId})

  const query = useQuery({
    ...(getAccountByIdQueryOptions({accountId}, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetAccountById400 | GetAccountById404 | GetAccountById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}