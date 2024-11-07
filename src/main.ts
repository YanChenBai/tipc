import type { IpcMainEvent } from 'electron'
import type { Obj } from './type'
import { BrowserWindow, ipcMain } from 'electron'
import { formatChannelName, GET_WIN_ID_CHANNEL, INVOKE_CHANNEL, Method } from './common'

/**
 * 注册 handler
 * @param win 窗口实例
 * @param handler handler 对象
 * @returns 取消注册的方法
 */
export function registerHandler(win: BrowserWindow, handler: Obj) {
  const channel = formatChannelName(win.id, INVOKE_CHANNEL)

  ipcMain.handle(channel, async (event, method: string, ...args: any[]) => {
    const func = handler[method]

    try {
      if (!func)
        throw new Error(`${channel} channel: method ${method} not found.`)

      if (typeof func !== 'function')
        throw new Error(`${channel} channel: method ${method} is not a function.`)

      const win = BrowserWindow.fromId(event.sender.id)

      const result = await Promise.resolve(func({ event, win }, ...args))

      return result
    }
    catch (error) {
      console.error(String(error))
    }
  })

  const remove = () => ipcMain.removeHandler(channel)

  win.on('closed', remove)

  return remove
}

/**
 * 批量注册 handler
 * @param win 窗口对象
 * @param handlers handler 对象数组
 * @returns 返回一个取消注册函数数组
 */
export function batchRegisterHandlers(win: BrowserWindow, handlers: Obj[]) {
  return handlers.map(handler => registerHandler(win, handler))
}

/** 创建发送 IPC 消息的函数 */
export function createSender<T extends Obj>(win: BrowserWindow, props: T): T {
  const initial = {} as T

  return Object.keys(props).reduce((acc, method) => {
    if (props[method] !== Method)
      return acc;

    (acc as any)[method] = (...args: any[]) =>
      win.webContents.send(formatChannelName(win.id, method), ...args)

    return acc
  }, initial)
}

/** 初始化 TIPC */
export function initTIPC() {
  const listener = (event: IpcMainEvent) => event.returnValue = event.sender.id
  ipcMain.on(GET_WIN_ID_CHANNEL, listener)

  return () => {
    ipcMain.removeListener(GET_WIN_ID_CHANNEL, listener)
  }
}
