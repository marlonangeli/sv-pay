import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, QueryObserverOptions, UseQueryResult} from '@tanstack/react-query'
import {queryOptions, useQuery} from '@tanstack/react-query'
import type {
  GetUserById400,
  GetUserById404,
  GetUserById500,
  GetUserByIdPathParams,
  GetUserByIdQueryResponse
} from '@/http/generated'
import {getUserById} from '@/http/generated'

export const getUserByIdQueryKey = ({userId}: { userId: GetUserByIdPathParams['userId'] }) =>
  [{url: '/api/v1/users/:userId', params: {userId: userId}}] as const

export type GetUserByIdQueryKey = ReturnType<typeof getUserByIdQueryKey>

export function getUserByIdQueryOptions(
  {userId}: { userId: GetUserByIdPathParams['userId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getUserByIdQueryKey({userId})
  return queryOptions<
    ResponseConfig<GetUserByIdQueryResponse>,
    ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>,
    ResponseConfig<GetUserByIdQueryResponse>,
    typeof queryKey
  >({
    enabled: !!userId,
    queryKey,
    queryFn: async ({signal}) => {
      config.signal = signal
      return getUserById({userId}, config)
    },
  })
}

/**
 * @description Get user by ID
 * {@link /api/v1/users/:userId}
 */
export function useGetUserById<
  TData = ResponseConfig<GetUserByIdQueryResponse>,
  TQueryData = ResponseConfig<GetUserByIdQueryResponse>,
  TQueryKey extends QueryKey = GetUserByIdQueryKey,
>(
  {userId}: { userId: GetUserByIdPathParams['userId'] },
  options: {
    query?: Partial<
      QueryObserverOptions<
        ResponseConfig<GetUserByIdQueryResponse>,
        ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>,
        TData,
        TQueryData,
        TQueryKey
      >
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUserByIdQueryKey({userId})

  const query = useQuery({
    ...(getUserByIdQueryOptions({userId}, config) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
  }) as UseQueryResult<TData, ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}