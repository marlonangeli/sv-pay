import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, QueryObserverOptions, UseQueryResult} from '@tanstack/react-query'
import {queryOptions, useQuery} from '@tanstack/react-query'
import type {
  GetTransactionById404,
  GetTransactionById500,
  GetTransactionByIdPathParams,
  GetTransactionByIdQueryResponse,
} from '@/http/generated'
import {getTransactionById} from '@/http/generated'

export const getTransactionByIdQueryKey = ({transactionId}: {
  transactionId: GetTransactionByIdPathParams['transactionId']
}) =>
  [{url: '/api/v1/transactions/:transactionId', params: {transactionId: transactionId}}] as const

export type GetTransactionByIdQueryKey = ReturnType<typeof getTransactionByIdQueryKey>

export function getTransactionByIdQueryOptions(
  {transactionId}: { transactionId: GetTransactionByIdPathParams['transactionId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTransactionByIdQueryKey({transactionId})
  return queryOptions<
    ResponseConfig<GetTransactionByIdQueryResponse>,
    ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>,
    ResponseConfig<GetTransactionByIdQueryResponse>,
    typeof queryKey
  >({
    enabled: !!transactionId,
    queryKey,
    queryFn: async ({signal}) => {
      config.signal = signal
      return getTransactionById({transactionId}, config)
    },
  })
}

/**
 * @description Get transaction by id
 * {@link /api/v1/transactions/:transactionId}
 */
export function useGetTransactionById<
  TData = ResponseConfig<GetTransactionByIdQueryResponse>,
  TQueryData = ResponseConfig<GetTransactionByIdQueryResponse>,
  TQueryKey extends QueryKey = GetTransactionByIdQueryKey,
>(
  {transactionId}: { transactionId: GetTransactionByIdPathParams['transactionId'] },
  options: {
    query?: Partial<
      QueryObserverOptions<
        ResponseConfig<GetTransactionByIdQueryResponse>,
        ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTransactionByIdQueryKey({transactionId})

  const query = useQuery({
    ...(getTransactionByIdQueryOptions({transactionId}, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}