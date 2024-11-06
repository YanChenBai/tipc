import type { Func, Invoke, Listener, Obj, ObjectToHandler, Req } from './type'
import { BrowserWindow, ipcMain } from 'electron'
import { formatChannelName, GET_WIN_ID_CHANNEL, INVOKE_CHANNEL } from './common'

// 在主进程中注册 IPC 处理程序
export function registerHandler(win: BrowserWindow, handlers: Obj) {
  const name = formatChannelName(win.id, INVOKE_CHANNEL)

  ipcMain.handle(formatChannelName(win.id, INVOKE_CHANNEL), async (event, method: string, ...args: any[]) => {
    const func = handlers[method]

    try {
      if (!func)
        throw new Error(`${name} channel: method ${method} not found.`)

      if (typeof func !== 'function')
        throw new Error(`${name} channel: method ${method} is not a function.`)

      const win = BrowserWindow.getAllWindows().find(i => i.id === event.sender.id)

      const result = await Promise.resolve(func({ event, win }, ...args))

      return result
    }
    catch (error) {
      console.error(String(error))
    }
  })
}

// 创建发送 IPC 消息的函数
export function createSender<T extends Obj>(win: BrowserWindow, props: T): T {
  const initial = {} as T
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName]
    if (typeof method === 'function') {
      (acc as any)[methodName] = (...args: any[]) =>
        win.webContents.send(formatChannelName(win.id, methodName), ...args)
    }
    return acc
  }, initial)
}

export function initTIPC() {
  ipcMain.on(GET_WIN_ID_CHANNEL, event => event.returnValue = event.sender.id)
}

export { Func, Invoke, Listener, Obj, ObjectToHandler, Req }
