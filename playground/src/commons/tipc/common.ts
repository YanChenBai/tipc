import { Method } from 'tipc'

export const CommonHandlerProps = {
  minimize: Method as () => void,
}

export const CommonListenerProps = {
  tell: Method as (msg: string) => void,

}

export type ICommonHandler = typeof CommonHandlerProps
export type ICommonListener = typeof CommonListenerProps
