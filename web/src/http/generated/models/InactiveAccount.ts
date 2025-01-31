import type {InactiveAccountCommand} from './InactiveAccountCommand.ts'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description No Content
 */
export type InactiveAccount204 = any

/**
 * @description Bad Request
 */
export type InactiveAccount400 = ProblemDetails

/**
 * @description Not Found
 */
export type InactiveAccount404 = ProblemDetails

/**
 * @description Conflict
 */
export type InactiveAccount409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type InactiveAccount500 = ProblemDetails

export type InactiveAccountMutationRequest = InactiveAccountCommand

export type InactiveAccountMutationResponse = InactiveAccount204

export type InactiveAccountMutation = {
  Response: InactiveAccount204
  Request: InactiveAccountMutationRequest
  Errors: InactiveAccount400 | InactiveAccount404 | InactiveAccount409 | InactiveAccount500
}