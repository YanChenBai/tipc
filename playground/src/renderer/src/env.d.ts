/// <reference types="vite/client" />
import '@byc/tipc'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '@byc/tipc' {
  interface TipcInvokeExpose {
    common: {
      hello: (msg: string) => void
    }
  }
}

export {}
