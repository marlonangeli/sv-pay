import type {RequestConfig, ResponseConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult} from '@tanstack/react-query'
import {queryOptions, useSuspenseQuery} from '@tanstack/react-query'
import type {
  GetUserById400,
  GetUserById404,
  GetUserById500,
  GetUserByIdPathParams,
  GetUserByIdQueryResponse
} from '@/http/generated'
import {getUserById} from '@/http/generated'

export const getUserByIdSuspenseQueryKey = ({userId}: { userId: GetUserByIdPathParams['userId'] }) =>
  [{url: '/api/v1/users/:userId', params: {userId: userId}}] as const

export type GetUserByIdSuspenseQueryKey = ReturnType<typeof getUserByIdSuspenseQueryKey>

export function getUserByIdSuspenseQueryOptions(
  {userId}: { userId: GetUserByIdPathParams['userId'] },
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const queryKey = getUserByIdSuspenseQueryKey({userId})
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
export function useGetUserByIdSuspense<
  TData = ResponseConfig<GetUserByIdQueryResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TQueryData = ResponseConfig<GetUserByIdQueryResponse>,
  TQueryKey extends QueryKey = GetUserByIdSuspenseQueryKey,
>(
  {userId}: { userId: GetUserByIdPathParams['userId'] },
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<ResponseConfig<GetUserByIdQueryResponse>, ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>, TData, TQueryKey>
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const {query: queryOptions, client: config = {}} = options ?? {}
  const queryKey = queryOptions?.queryKey ?? getUserByIdSuspenseQueryKey({userId})

  const query = useSuspenseQuery({
    ...(getUserByIdSuspenseQueryOptions({userId}, config) as unknown as UseSuspenseQueryOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<UseSuspenseQueryOptions, 'queryKey'>),
  }) as UseSuspenseQueryResult<TData, ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>> & {
    queryKey: TQueryKey
  }

  query.queryKey = queryKey as TQueryKey

  return query
}