import { TIpcFunc } from 'tipc/renderer'

export const CommonListenerMethods = {
  tell: TIpcFunc as (msg: string) => void,
}

export type ICommonListener = typeof CommonListenerMethods
