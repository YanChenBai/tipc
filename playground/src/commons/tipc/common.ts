import { defineProto, Method } from 'tipc'

export const CommonHandlerMethods = defineProto('common', {
  minimize: Method as () => void,
})

export const Common2HandlerMethods = defineProto('common2', {
  getWinId: Method as () => number,
})

export const CommonListenerMethods = defineProto('common', {
  tell: Method as (msg: string) => void,
})

export type ICommonHandler = typeof CommonHandlerMethods
export type ICommon2Handler = typeof Common2HandlerMethods
export type ICommonListener = typeof CommonListenerMethods
