import type {Account} from './Account.ts'
import type {Money} from './Money.ts'
import type {TransactionType} from '@/http/generated'

export type Transaction = {
  /**
   * @type string | undefined, uuid
   */
  id?: string
  /**
   * @type string | undefined, date-time
   */
  readonly createdAt?: Date
  /**
   * @type string | undefined, date-time
   */
  readonly updatedAt?: Date
  /**
   * @type object | undefined
   */
  amount?: Money
  /**
   * @type string | undefined, date-time
   */
  date?: Date
  /**
   * @type string | undefined, uuid
   */
  accountId?: string
  /**
   * @type object | undefined
   */
  account?: Account
  /**
   * @type string, uuid
   */
  relatedAccountId?: string | null
  /**
   * @type object | undefined
   */
  relatedAccount?: Account
  /**
   * @type integer | undefined, int32
   */
  type?: TransactionType
  /**
   * @type string
   */
  description?: string | null
}