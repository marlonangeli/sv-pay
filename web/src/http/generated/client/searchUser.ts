import type {RequestConfig, ResponseErrorConfig} from '@/http/client-fetch'
import client from '@/http/client-fetch'
import type {
  SearchUser400,
  SearchUser404,
  SearchUser409,
  SearchUser500,
  SearchUserMutationRequest,
  SearchUserMutationResponse
} from '@/http/generated'

export function getSearchUserUrl() {
  return `/api/v1/users/search` as const
}

/**
 * @description Get user by email or CPF
 * {@link /api/v1/users/search}
 */
export async function searchUser(
  data?: SearchUserMutationRequest,
  config: Partial<RequestConfig<SearchUserMutationRequest>> & { client?: typeof client } = {},
) {
  const {client: request = client, ...requestConfig} = config

  const res = await request<
    SearchUserMutationResponse,
    ResponseErrorConfig<SearchUser400 | SearchUser404 | SearchUser409 | SearchUser500>,
    SearchUserMutationRequest
  >({method: 'POST', url: getSearchUserUrl().toString(), data, ...requestConfig})
  return res
}