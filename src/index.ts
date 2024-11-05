import type { BrowserWindow } from 'electron'
import type { Invoke, IpcHandler, Listener } from './types'
import { ipcMain } from 'electron'

export type { ExposeInvoke, ExposeListener, Listener } from './types'

// 在主进程中注册 IPC 处理程序
export function registerHandler(api: IpcHandler) {
  const { handlers, name } = api

  if (!handlers)
    return

  ipcMain.handle(name, async (event, method: string, ...args: any[]) => {
    const func = handlers[method]

    try {
      if (!func)
        throw new Error(`${name} channel: method ${method} not found.`)

      if (typeof func !== 'function')
        throw new Error(`${name} channel: method ${method} is not a function.`)

      const result = await Promise.resolve(func(event, ...args))

      return result
    }
    catch (error) {
      console.error(String(error))
    }
  })
}

// 创建发送 IPC 消息的函数
export function createSender<T extends Record<string, any>>(win: BrowserWindow) {
  return <K extends keyof T>(method: K, ...args: T[K] extends (...args: infer A) => any ? A : never) => {
    win.webContents.send(method as string, ...args)
  }
}

// 暴露主进程的 IPC 调用方法
export function exposeInvoke(invoke: Invoke, mainHandler: IpcHandler) {
  const { handlers, name } = mainHandler

  return Object.fromEntries(
    Object.keys(handlers)
      .filter(method => typeof handlers[method] === 'function')
      .map(method => [method, (...args: any[]) => invoke(name, method, ...args)]),
  )
}

// 暴露渲染进程的 IPC 监听函数
export function exposeListener<T extends Record<string, any>>(listener: Listener) {
  return () => <K extends keyof T>(method: K, callback: (...args: Parameters<T[K]>) => void) => {
    listener(method as string, (...args: Parameters<T[K]>) => callback(...args))
  }
}
