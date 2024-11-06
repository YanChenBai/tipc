import type { ExposeListener } from 'tipc/renderer'
import type { ICommonHandler } from '../commons/handler/commonHandler'
import type { ICommonListener } from '../commons/listener/commonListener'

declare global {
  interface Window {
    listener: ExposeListener<ICommonListener>
    invoke: ICommonHandler
  }
}

export {}
