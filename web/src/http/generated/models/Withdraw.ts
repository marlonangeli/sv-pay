import type {CreateWithdrawCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description Created
 */
export type Withdraw201 = string

/**
 * @description Bad Request
 */
export type Withdraw400 = ProblemDetails

/**
 * @description Not Found
 */
export type Withdraw404 = ProblemDetails

/**
 * @description Conflict
 */
export type Withdraw409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type Withdraw500 = ProblemDetails

export type WithdrawMutationRequest = CreateWithdrawCommand

export type WithdrawMutationResponse = Withdraw201

export type WithdrawMutation = {
  Response: Withdraw201
  Request: WithdrawMutationRequest
  Errors: Withdraw400 | Withdraw404 | Withdraw409 | Withdraw500
}