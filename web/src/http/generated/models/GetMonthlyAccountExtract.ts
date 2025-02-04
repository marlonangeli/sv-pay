import type {MonthlyAccountExtract} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

export type GetMonthlyAccountExtractPathParams = {
  /**
   * @type string, uuid
   */
  accountId: string
}

export type GetMonthlyAccountExtractQueryParams = {
  /**
   * @type integer, int32
   */
  year: number
  /**
   * @type integer, int32
   */
  month: number
}

/**
 * @description OK
 */
export type GetMonthlyAccountExtract200 = MonthlyAccountExtract

/**
 * @description Bad Request
 */
export type GetMonthlyAccountExtract400 = ProblemDetails

/**
 * @description Not Found
 */
export type GetMonthlyAccountExtract404 = ProblemDetails

/**
 * @description Conflict
 */
export type GetMonthlyAccountExtract409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type GetMonthlyAccountExtract500 = ProblemDetails

export type GetMonthlyAccountExtractQueryResponse = GetMonthlyAccountExtract200

export type GetMonthlyAccountExtractQuery = {
  Response: GetMonthlyAccountExtract200
  PathParams: GetMonthlyAccountExtractPathParams
  QueryParams: GetMonthlyAccountExtractQueryParams
  Errors: GetMonthlyAccountExtract400 | GetMonthlyAccountExtract404 | GetMonthlyAccountExtract409 | GetMonthlyAccountExtract500
}