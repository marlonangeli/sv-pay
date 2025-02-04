import type {CreateAccountCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description Created
 */
export type CreateAccount201 = string

/**
 * @description Bad Request
 */
export type CreateAccount400 = ProblemDetails

/**
 * @description Conflict
 */
export type CreateAccount409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type CreateAccount500 = ProblemDetails

export type CreateAccountMutationRequest = CreateAccountCommand

export type CreateAccountMutationResponse = CreateAccount201

export type CreateAccountMutation = {
  Response: CreateAccount201
  Request: CreateAccountMutationRequest
  Errors: CreateAccount400 | CreateAccount409 | CreateAccount500
}