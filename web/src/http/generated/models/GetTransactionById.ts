import type {ProblemDetails} from './ProblemDetails.ts'
import type {Transaction} from './Transaction.ts'

export type GetTransactionByIdPathParams = {
  /**
   * @type string, uuid
   */
  transactionId: string
}

/**
 * @description OK
 */
export type GetTransactionById200 = Transaction

/**
 * @description Not Found
 */
export type GetTransactionById404 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type GetTransactionById500 = ProblemDetails

export type GetTransactionByIdQueryResponse = GetTransactionById200

export type GetTransactionByIdQuery = {
  Response: GetTransactionById200
  PathParams: GetTransactionByIdPathParams
  Errors: GetTransactionById404 | GetTransactionById500
}