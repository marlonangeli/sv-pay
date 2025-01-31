export type ProblemDetails = {
  /**
   * @type string
   */
  type?: string | null
  /**
   * @type string
   */
  title?: string | null
  /**
   * @type integer, int32
   */
  status?: number | null
  /**
   * @type string
   */
  detail?: string | null
  /**
   * @type string
   */
  instance?: string | null

  errors?: Array<{
    /**
     * @type string
     */
    code?: string | null
    /**
     * @type string
     */
    description?: string | null
    /**
     * @type string
     */
    type?: string | null
  }> | null
}