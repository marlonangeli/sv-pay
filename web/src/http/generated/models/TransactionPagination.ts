import type {Transaction} from './Transaction.ts'

export type TransactionPagination = {
  /**
   * @type array
   */
  items?: Transaction[] | null
  /**
   * @type integer | undefined, int32
   */
  totalCount?: number
  /**
   * @type integer | undefined, int32
   */
  page?: number
  /**
   * @type integer | undefined, int32
   */
  pageSize?: number
  /**
   * @type integer | undefined, int32
   */
  readonly totalPages?: number
  /**
   * @type boolean | undefined
   */
  readonly hasNextPage?: boolean
  /**
   * @type boolean | undefined
   */
  readonly hasPreviousPage?: boolean
}