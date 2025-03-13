import type { Func } from './type'
import { TIPC_EXPOSE_NAME } from './common'

export interface TipcExpose {
  invoke: object
  listener: object
}

function proxyInvoke() {
  const invoke = window[TIPC_EXPOSE_NAME].invoke
  window[TIPC_EXPOSE_NAME].invoke = new Proxy({}, {
    get(_target, name) {
      return new Proxy(() => {}, {
        get(_target, method) {
          return (...args: any[]) => {
            return invoke(name.toString(), method.toString(), ...args)
          }
        },
      })
    },
  }) as TipcExpose['invoke']
}

function proxyListener() {
  const listener = window[TIPC_EXPOSE_NAME].listener
  window[TIPC_EXPOSE_NAME].listener = new Proxy({}, {
    get(_target, name) {
      return new Proxy(() => {}, {
        get(_target, method) {
          return (callback: Func) => {
            return listener(name.toString(), method.toString(), callback)
          }
        },
      })
    },
  }) as TipcExpose['listener']
}

export function iniTipc() {
  proxyInvoke()
  proxyListener()
}
