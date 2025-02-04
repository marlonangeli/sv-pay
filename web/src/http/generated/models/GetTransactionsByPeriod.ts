import type {ProblemDetails} from './ProblemDetails.ts'
import type {TransactionPagination} from '@/http/generated'

export type GetTransactionsByPeriodPathParams = {
  /**
   * @type string, uuid
   */
  accountId: string
}

export type GetTransactionsByPeriodQueryParams = {
  /**
   * @type string, date-time
   */
  startDate: Date
  /**
   * @type string, date-time
   */
  endDate: Date
  /**
   * @default 1
   * @type integer | undefined, int32
   */
  page?: number
  /**
   * @default 100
   * @type integer | undefined, int32
   */
  pageSize?: number
}

/**
 * @description OK
 */
export type GetTransactionsByPeriod200 = TransactionPagination

/**
 * @description Bad Request
 */
export type GetTransactionsByPeriod400 = ProblemDetails

/**
 * @description Not Found
 */
export type GetTransactionsByPeriod404 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type GetTransactionsByPeriod500 = ProblemDetails

export type GetTransactionsByPeriodQueryResponse = GetTransactionsByPeriod200

export type GetTransactionsByPeriodQuery = {
  Response: GetTransactionsByPeriod200
  PathParams: GetTransactionsByPeriodPathParams
  QueryParams: GetTransactionsByPeriodQueryParams
  Errors: GetTransactionsByPeriod400 | GetTransactionsByPeriod404 | GetTransactionsByPeriod500
}