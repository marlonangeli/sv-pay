import type {CreateDepositCommand} from './CreateDepositCommand.ts'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description Created
 */
export type Deposit201 = string

/**
 * @description Bad Request
 */
export type Deposit400 = ProblemDetails

/**
 * @description Not Found
 */
export type Deposit404 = ProblemDetails

/**
 * @description Conflict
 */
export type Deposit409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type Deposit500 = ProblemDetails

export type DepositMutationRequest = CreateDepositCommand

export type DepositMutationResponse = Deposit201

export type DepositMutation = {
  Response: Deposit201
  Request: DepositMutationRequest
  Errors: Deposit400 | Deposit404 | Deposit409 | Deposit500
}