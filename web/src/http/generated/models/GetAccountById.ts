import type {Account} from './Account.ts'
import type {ProblemDetails} from './ProblemDetails.ts'

export type GetAccountByIdPathParams = {
  /**
   * @type string, uuid
   */
  accountId: string
}

/**
 * @description OK
 */
export type GetAccountById200 = Account

/**
 * @description Bad Request
 */
export type GetAccountById400 = ProblemDetails

/**
 * @description Not Found
 */
export type GetAccountById404 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type GetAccountById500 = ProblemDetails

export type GetAccountByIdQueryResponse = GetAccountById200

export type GetAccountByIdQuery = {
  Response: GetAccountById200
  PathParams: GetAccountByIdPathParams
  Errors: GetAccountById400 | GetAccountById404 | GetAccountById500
}