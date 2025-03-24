import type { WindowHandler, WindowListener } from './type'

export {}

declare module '@byc/tipc' {
  interface TipcInvokeExpose {
    window: WindowHandler
  }

  interface TipcListenerExpose {
    window: WindowListener
  }
}
