import type { Invoke, Listener, Obj } from './type'
import { ipcRenderer } from 'electron'
import { formatChannelName, GET_WIN_ID_CHANNEL, INVOKE_CHANNEL, TIpcFunc } from './common'

function getInvokes(invoke: Invoke, channel: string, props: Obj): Record<string, any> {
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName]
    if (method === Function)
      acc[methodName] = (...args: any[]) => invoke(channel, methodName, ...args)

    return acc
  }, {} as Obj)
}

// 暴露主进程的 IPC 调用方法
export function exposeInvoke(invoke: Invoke, props: Obj) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)
  return getInvokes(invoke, formatChannelName(id, INVOKE_CHANNEL), props)
}

// 暴露渲染进程的 IPC 监听函数
export function exposeListener<T extends Obj>(listener: Listener) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)

  return () => <K extends keyof T>(method: K, callback: (...args: any[]) => void) => {
    listener(formatChannelName(id, String(method)), (...args: any[]) => callback(...args))
  }
}

export {
  TIpcFunc,
}
