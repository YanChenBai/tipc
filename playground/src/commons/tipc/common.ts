import { defineProto, Method } from '@byc/tipc'

export const CommonHandlerProto = defineProto('CommonHandler', {
  minimize: Method as () => void,
})

export const CommonListenerProto = defineProto('CommonListener', {
  tell: Method as (msg: string) => void,
})

export type ICommonHandler = typeof CommonHandlerProto
export type ICommonListener = typeof CommonListenerProto
