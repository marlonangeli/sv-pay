import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  GetUserById400,
  GetUserById404,
  GetUserById500,
  GetUserByIdPathParams,
  GetUserByIdQueryResponse
} from '@/http/generated'

export function getGetUserByIdUrl({userId}: { userId: GetUserByIdPathParams['userId'] }) {
  return `/api/v1/users/${userId}` as const
}

/**
 * @description Get user by ID
 * {@link /api/v1/users/:userId}
 */
export async function getUserById({userId}: {
  userId: GetUserByIdPathParams['userId']
}, config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<GetUserByIdQueryResponse, ResponseErrorConfig<GetUserById400 | GetUserById404 | GetUserById500>, unknown>({
    method: 'GET',
    url: getGetUserByIdUrl({userId}).toString(),
    ...requestConfig,
  })
  return res
}