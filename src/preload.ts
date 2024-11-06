import type { Func, Obj } from './type'
import { ipcRenderer } from 'electron'
import { formatChannelName, GET_WIN_ID_CHANNEL, INVOKE_CHANNEL, TIpcFunc } from './common'

// 暴露主进程的 IPC 调用方法
export function exposeInvoke(props: Obj) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)
  const channel = formatChannelName(id, INVOKE_CHANNEL)

  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName]
    if (method === Function)
      acc[methodName] = (...args: any[]) => ipcRenderer.invoke(channel, methodName, ...args)

    return acc
  }, {} as Obj)
}

const listener = (channel: string, cb: (...args: any[]) => void) => ipcRenderer.on(channel, (_e, ...args: any[]) => cb(...args))

// 暴露渲染进程的 IPC 监听函数
export function exposeListener(props: Obj) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)

  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName]
    if (method === Function) {
      acc[methodName] = (cb: Func) => {
        listener(formatChannelName(id, methodName), (...args) => cb(...args))
      }
    }

    return acc
  }, {} as Obj)
}

export {
  TIpcFunc,
}
