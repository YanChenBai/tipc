import type { ExposeInvokes, ExposeListeners } from 'tipc/renderer'
import type { ICommon2Handler, ICommonHandler, ICommonListener } from '../commons/tipc/common'

declare global {
  interface Window {
    listener: ExposeListeners<ICommonListener>
    invoke: ExposeInvokes<ICommonHandler>
    invoke2: ExposeInvokes<ICommon2Handler>
  }
}

export {}
