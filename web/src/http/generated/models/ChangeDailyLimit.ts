import type {ChangeDailyLimitCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description No Content
 */
export type ChangeDailyLimit204 = never

/**
 * @description Bad Request
 */
export type ChangeDailyLimit400 = ProblemDetails

/**
 * @description Not Found
 */
export type ChangeDailyLimit404 = ProblemDetails

/**
 * @description Conflict
 */
export type ChangeDailyLimit409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type ChangeDailyLimit500 = ProblemDetails

export type ChangeDailyLimitMutationRequest = ChangeDailyLimitCommand

export type ChangeDailyLimitMutationResponse = ChangeDailyLimit204

export type ChangeDailyLimitMutation = {
  Response: ChangeDailyLimit204
  Request: ChangeDailyLimitMutationRequest
  Errors: ChangeDailyLimit400 | ChangeDailyLimit404 | ChangeDailyLimit409 | ChangeDailyLimit500
}