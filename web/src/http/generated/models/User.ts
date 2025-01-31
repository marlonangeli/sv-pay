import type {Account} from './Account.ts'
import type {CPF} from './CPF.ts'

export type User = {
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
   * @type string | undefined, date
   */
  birthDate?: Date
  /**
   * @type object | undefined
   */
  cpf?: CPF
  /**
   * @type array
   */
  accounts?: Account[] | null
  /**
   * @type string
   */
  readonly fullName?: string | null
}