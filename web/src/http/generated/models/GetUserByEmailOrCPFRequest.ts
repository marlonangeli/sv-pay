import type {GetUserRequestType} from '@/http/generated'

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