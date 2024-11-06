import type { ExposeListener } from 'tipc/renderer'
import type { ICommonHandler } from '../commons/handler/commonHandler'

declare global {
  interface Window {
    createListener: ExposeListener
    invoke: ICommonHandler
  }
}

export {}
