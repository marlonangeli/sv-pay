import type {GetUserRequestType} from './GetUserRequestType.ts'

export type GetUserByEmailOrCPFRequest = {
  /**
   * @type integer | undefined, int32
   */
  type?: GetUserRequestType
  /**
   * @type string
   */
  value?: string | null
}