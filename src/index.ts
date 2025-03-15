import type { PreloadExpose } from './common'
import { TIPC_EXPOSE_NAME } from './common'

type Func = (...args: any[]) => any

type FuncToPromise<T extends Func> = (...args: Parameters<T>) => ReturnType<T> extends Promise<any>
  ? ReturnType<T>
  : Promise<ReturnType<T>>

type ConvertInvoke<T extends Record<string, Record<string, Func>>> = {
  [K in keyof T]: {
    [V in keyof T[K]]: FuncToPromise<T[K][V]>
  }
}

type ConvertListener<T extends Record<string, Record<string, Func>>> = {
  [K in keyof T]: {
    [V in keyof T[K]]: (callback: (...args: Parameters<T[K][V]>) => void) => () => void
  }
}

export interface TipcInvokeExpose {
  [key: string]: Record<string, Func>
}

export interface TipcListenerExpose {
  [key: string]: Record<string, Func>
}

const tipc: PreloadExpose = {
  invoke(name: string, method: string, ...args: any[]) {
    return window[TIPC_EXPOSE_NAME].invoke(name, method, ...args)
  },

  listener(name: string, method: string, cb: Func) {
    return window[TIPC_EXPOSE_NAME].listener(name, method, cb)
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

export const invoke = createProxy<ConvertInvoke<TipcInvokeExpose>>((name, method) => {
  return (...args: any[]) => tipc.invoke(name, method, ...args)
})

export const listener = createProxy<ConvertListener<TipcListenerExpose>>((name, method) => {
  return (callback: Func) => tipc.listener(name, method, callback)
})
