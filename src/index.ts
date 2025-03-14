import type { Func } from './type'
import { TIPC_EXPOSE_NAME } from './common'

export interface TipcInvokeExpose {
}

export interface TipcListenerExpose {
}

const tipc = {
  get invoke() {
    return window[TIPC_EXPOSE_NAME].invoke as (name: string, method: string, ...args: any[]) => any
  },
  get listener() {
    return window[TIPC_EXPOSE_NAME].listener as (name: string, method: string, cb: (...args: any[]) => void) => any
  },
}

function createProxy<T>(func: (name: string, method: string) => any) {
  return new Proxy({}, {
    get(_target, name) {
      return new Proxy({}, {
        get(_target, method) {
          return func(name.toString(), method.toString())
        },
      })
    },
  }) as T
}

export const invoke = createProxy<TipcInvokeExpose>((name, method) => {
  return (...args: any[]) => tipc.invoke(name, method, ...args)
})

export const listener = createProxy<TipcListenerExpose>((name, method) => {
  return (callback: Func) => tipc.listener(name, method, callback)
})
