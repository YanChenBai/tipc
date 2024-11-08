import type { Func, Methods, TIPCMethods } from './type'
import { ipcRenderer } from 'electron'
import { formatChannelName, INVOKE_CHANNEL, Method } from './common'

/** 暴露主进程的 IPC 调用方法 */
export function exposeInvoke(proto: TIPCMethods) {
  const { name, methods } = proto
  const channel = formatChannelName(INVOKE_CHANNEL, name)

  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName]
    if (method === Method)
      acc[methodName] = (...args: any[]) => ipcRenderer.invoke(channel, methodName, ...args)

    return acc
  }, {} as Methods)
}

/** 暴露渲染进程的 IPC 监听函数 */
export function exposeListener(proto: TIPCMethods) {
  const { name, methods } = proto
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName]
    if (method === Method) {
      acc[methodName] = (cb: Func) => {
        const channel = formatChannelName(name, methodName)
        const listener = (_e, ...args: any[]) => cb(...args)

        ipcRenderer.on(channel, listener)

        return () => {
          ipcRenderer.removeListener(channel, listener)
        }
      }
    }

    return acc
  }, {} as Methods)
}
