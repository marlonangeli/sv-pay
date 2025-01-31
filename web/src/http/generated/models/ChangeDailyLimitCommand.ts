export type ChangeDailyLimitCommand = {
  /**
   * @type string | undefined, uuid
   */
  accountId?: string
  /**
   * @type number | undefined, double
   */
  dailyLimit?: number
}