import type { ExposeInvokes, ExposeListeners, Func, TIPCMethods } from './type'
import { ipcRenderer } from 'electron'
import { geListenerName, getHandlerName, Method } from './common'

/** 暴露主进程的 IPC 调用方法 */
export function exposeInvokes<T extends TIPCMethods, M = ExposeInvokes<T>>(proto: T) {
  const { name, methods } = proto
  const channel = getHandlerName(name)

  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName]
    if (method === Method)
      acc[methodName] = (...args: any[]) => ipcRenderer.invoke(channel, methodName, ...args)

    return acc
  }, {} as M)
}

/** 暴露渲染进程的 IPC 监听函数 */
export function exposeListeners<T extends TIPCMethods, M = ExposeListeners<T>>(proto: T) {
  const { name, methods } = proto
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName]
    if (method === Method) {
      acc[methodName] = (cb: Func) => {
        const channel = geListenerName(name, methodName)
        const listener = (_e, ...args: any[]) => cb(...args)

        ipcRenderer.on(channel, listener)

        return () => {
          ipcRenderer.removeListener(channel, listener)
        }
      }
    }
    return acc
  }, {} as M)
}
