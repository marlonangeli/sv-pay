import type {BlockAccountCommand} from '@/http/generated'
import type {ProblemDetails} from './ProblemDetails.ts'

/**
 * @description No Content
 */
export type BlockAccount204 = never

/**
 * @description Bad Request
 */
export type BlockAccount400 = ProblemDetails

/**
 * @description Not Found
 */
export type BlockAccount404 = ProblemDetails

/**
 * @description Conflict
 */
export type BlockAccount409 = ProblemDetails

/**
 * @description Internal Server Error
 */
export type BlockAccount500 = ProblemDetails

export type BlockAccountMutationRequest = BlockAccountCommand

export type BlockAccountMutationResponse = BlockAccount204

export type BlockAccountMutation = {
  Response: BlockAccount204
  Request: BlockAccountMutationRequest
  Errors: BlockAccount400 | BlockAccount404 | BlockAccount409 | BlockAccount500
}