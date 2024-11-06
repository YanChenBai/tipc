import { TIpcFunc } from 'tipc/renderer'

export const CommonHandlerMethods = {
  minimize: TIpcFunc as () => void,
}

export type ICommonHandler = typeof CommonHandlerMethods
