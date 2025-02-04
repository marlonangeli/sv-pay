import type {CreateUserCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description Created
 */
export type CreateUser201 = string

/**
 * @description Bad Request
 */
export type CreateUser400 = ProblemDetails

/**
 * @description Not Found
 */
export type CreateUser404 = ProblemDetails

/**
 * @description Conflict
 */
export type CreateUser409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type CreateUser500 = ProblemDetails

export type CreateUserMutationRequest = CreateUserCommand

export type CreateUserMutationResponse = CreateUser201

export type CreateUserMutation = {
  Response: CreateUser201
  Request: CreateUserMutationRequest
  Errors: CreateUser400 | CreateUser404 | CreateUser409 | CreateUser500
}