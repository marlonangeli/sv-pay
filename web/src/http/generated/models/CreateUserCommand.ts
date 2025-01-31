export type CreateUserCommand = {
  /**
   * @type string
   */
  firstName?: string | null
  /**
   * @type string
   */
  lastName?: string | null
  /**
   * @type string
   */
  email?: string | null
  /**
   * @type string | undefined, date-time
   */
  dateOfBirth?: Date
  /**
   * @type string
   */
  cpf?: string | null
}