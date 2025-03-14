/// <reference types="vite/client" />
import '@byc/tipc/renderer'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

declare module '@byc/tipc/renderer' {
  interface TipcExpose {
    name: (name: string) => string
  }
}

export {}
