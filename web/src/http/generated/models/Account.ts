import type {AccountStatus} from './AccountStatus.ts'
import type {AccountType} from './AccountType.ts'
import type {Money} from './Money.ts'
import type {Transaction} from './Transaction.ts'
import type {User} from './User.ts'

export type Account = {
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
   * @type string | undefined, uuid
   */
  userId?: string
  /**
   * @type object | undefined
   */
  user?: User
  /**
   * @type string
   */
  name?: string | null
  /**
   * @type array
   */
  transactions?: Transaction[] | null
  /**
   * @type object | undefined
   */
  balance?: Money
  /**
   * @type object | undefined
   */
  dailyLimit?: Money
  /**
   * @type integer | undefined, int32
   */
  status?: AccountStatus
  /**
   * @type integer | undefined, int32
   */
  type?: AccountType
}