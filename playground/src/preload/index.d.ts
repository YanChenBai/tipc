import type { ExposeInvoke, ExposeListener } from 'tipc/type'
import type { MainHandlerType } from '../main/handler'

declare global {
  interface Window {
    createListener: ExposeListener
    api: {
      main: ExposeInvoke<MainHandlerType>
    }
  }
}

export {}
