import type {AccountType} from './AccountType.ts'

export type CreateAccountCommand = {
  /**
   * @type string | undefined, uuid
   */
  userId?: string
  /**
   * @type string
   */
  name?: string | null
  /**
   * @type integer | undefined, int32
   */
  type?: AccountType
  /**
   * @type number | undefined, double
   */
  initialBalance?: number
  /**
   * @type number | undefined, double
   */
  dailyLimit?: number
}