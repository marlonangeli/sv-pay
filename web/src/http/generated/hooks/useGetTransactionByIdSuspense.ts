import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult} from '@tanstack/react-query'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import type {
  GetTransactionById404,
  GetTransactionById500,
  GetTransactionByIdPathParams,
  GetTransactionByIdQueryResponse,
} from '../models/GetTransactionById.ts'
import {getTransactionById} from '../client/getTransactionById.ts'

export const getTransactionByIdSuspenseQueryKey = ({transactionId}: {
  transactionId: GetTransactionByIdPathParams['transactionId']
}) =>
  [{url: '/api/v1/transactions/:transactionId', params: {transactionId: transactionId}}] as const

export type GetTransactionByIdSuspenseQueryKey = ReturnType<typeof getTransactionByIdSuspenseQueryKey>

export function getTransactionByIdSuspenseQueryOptions(
  {transactionId}: { transactionId: GetTransactionByIdPathParams['transactionId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getTransactionByIdSuspenseQueryKey({transactionId})
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
export function useGetTransactionByIdSuspense<
  TData = ResponseConfig<GetTransactionByIdQueryResponse>,
  TQueryData = ResponseConfig<GetTransactionByIdQueryResponse>,
  TQueryKey extends QueryKey = GetTransactionByIdSuspenseQueryKey,
>(
  {transactionId}: { transactionId: GetTransactionByIdPathParams['transactionId'] },
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<
        ResponseConfig<GetTransactionByIdQueryResponse>,
        ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>,
        TData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getTransactionByIdSuspenseQueryKey({transactionId})

  const query = useSuspenseQuery({
    ...(getTransactionByIdSuspenseQueryOptions({transactionId}, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetTransactionById404 | GetTransactionById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}