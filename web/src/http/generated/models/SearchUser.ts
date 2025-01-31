import type {GetUserByEmailOrCPFRequest} from './GetUserByEmailOrCPFRequest.ts'
import type {ProblemDetails} from './ProblemDetails.ts'
import type {User} from './User.ts'

/**
 * @description OK
 */
export type SearchUser200 = User

/**
 * @description Bad Request
 */
export type SearchUser400 = ProblemDetails

/**
 * @description Not Found
 */
export type SearchUser404 = ProblemDetails

/**
 * @description Conflict
 */
export type SearchUser409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type SearchUser500 = ProblemDetails

export type SearchUserMutationRequest = GetUserByEmailOrCPFRequest

export type SearchUserMutationResponse = SearchUser200

export type SearchUserMutation = {
  Response: SearchUser200
  Request: SearchUserMutationRequest
  Errors: SearchUser400 | SearchUser404 | SearchUser409 | SearchUser500
}