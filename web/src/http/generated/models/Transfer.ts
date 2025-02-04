import type {CreateTransferCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description Created
 */
export type Transfer201 = string

/**
 * @description Bad Request
 */
export type Transfer400 = ProblemDetails

/**
 * @description Not Found
 */
export type Transfer404 = ProblemDetails

/**
 * @description Conflict
 */
export type Transfer409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type Transfer500 = ProblemDetails

export type TransferMutationRequest = CreateTransferCommand

export type TransferMutationResponse = Transfer201

export type TransferMutation = {
  Response: Transfer201
  Request: TransferMutationRequest
  Errors: Transfer400 | Transfer404 | Transfer409 | Transfer500
}