import type { Invoke, Listener, Obj } from './type'
import { ipcRenderer } from 'electron'
import { formatChannelName, GET_WIN_ID_CHANNEL, INVOKE_CHANNEL } from './common'
// ipcRenderer

// 暴露主进程的 IPC 调用方法
export function exposeInvoke<T extends Obj>(invoke: Invoke) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)
  return () => <K extends keyof T> (method: K, ...args: any[]) => invoke(formatChannelName(id, INVOKE_CHANNEL), method, ...args)
}

// 暴露渲染进程的 IPC 监听函数
export function exposeListener<T extends Obj>(listener: Listener) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL)

  return () => <K extends keyof T>(method: K, callback: (...args: any[]) => void) => {
    listener(formatChannelName(id, String(method)), (...args: any[]) => callback(...args))
  }
}
