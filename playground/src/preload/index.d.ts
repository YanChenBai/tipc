import type { ExposeInvoke, ExposeListener } from 'tipc'
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
