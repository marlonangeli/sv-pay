import type {ProblemDetails} from './ProblemDetails.ts'
import type {User} from './User.ts'

export type GetUserByIdPathParams = {
  /**
   * @type string, uuid
   */
  userId: string
}

/**
 * @description OK
 */
export type GetUserById200 = User

/**
 * @description Bad Request
 */
export type GetUserById400 = ProblemDetails

/**
 * @description Not Found
 */
export type GetUserById404 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type GetUserById500 = ProblemDetails

export type GetUserByIdQueryResponse = GetUserById200

export type GetUserByIdQuery = {
  Response: GetUserById200
  PathParams: GetUserByIdPathParams
  Errors: GetUserById400 | GetUserById404 | GetUserById500
}