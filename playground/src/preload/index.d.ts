import type { ExposeInvokes, ExposeListeners } from 'tipc/renderer'
import type { ICommonHandler, ICommonListener } from '../commons/tipc/common'

declare global {
  interface Window {
    listener: ExposeListeners<ICommonListener>
    invoke: ExposeInvokes<ICommonHandler>
  }
}

export {}
