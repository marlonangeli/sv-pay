export type CreateWithdrawCommand = {
  /**
   * @type string | undefined, uuid
   */
  accountId?: string
  /**
   * @type number | undefined, double
   */
  amount?: number
  /**
   * @type string
   */
  description?: string | null
  /**
   * @type string | undefined, date-time
   */
  date?: Date
}