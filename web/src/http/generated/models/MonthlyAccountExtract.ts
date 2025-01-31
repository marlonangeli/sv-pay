import type {Money} from './Money.ts'
import type {Transaction} from './Transaction.ts'

export type MonthlyAccountExtract = {
  /**
   * @type object | undefined
   */
  initialBalance?: Money
  /**
   * @type object | undefined
   */
  finalBalance?: Money
  /**
   * @type object | undefined
   */
  totalIncome?: Money
  /**
   * @type object | undefined
   */
  totalOutcome?: Money
  /**
   * @type array
   */
  transactions?: Transaction[] | null
  /**
   * @type string | undefined, date-time
   */
  startDate?: Date
  /**
   * @type string | undefined, date-time
   */
  endDate?: Date
}