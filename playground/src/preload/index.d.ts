import type { ExposeInvoke, ExposeListener } from 'tipc/renderer'

declare global {
  interface Window {
    createListener: ExposeListener
    createInvoke: ExposeInvoke
  }
}

export {}
