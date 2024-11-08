import type { TIPCMethods } from './type'
import { app, BrowserWindow, ipcMain } from 'electron'
import { formatChannelName, INVOKE_CHANNEL, Method } from './common'

const registerList = new Set<string>()

/**
 * 注册 handler
 * @returns 取消注册的方法
 */
export function registerHandler(comply: TIPCMethods) {
  const { methods, name } = comply
  const channel = formatChannelName(INVOKE_CHANNEL, name)

  /** 避免重复注册 */
  if (registerList.has(channel))
    return

  ipcMain.handle(channel, async (event, methodName: string, ...args: any[]) => {
    const func = methods[methodName]

    try {
      if (!func)
        throw new Error(`${channel} channel: method ${methodName} not found.`)

      if (typeof func !== 'function')
        throw new Error(`${channel} channel: method ${methodName} is not a function.`)

      const win = BrowserWindow.fromId(event.sender.id)

      const result = await Promise.resolve(func({ event, win }, ...args))

      return result
    }
    catch (error) {
      console.error(String(error))
    }
  })

  registerList.add(channel)

  const remove = () => {
    ipcMain.removeHandler(channel)
    registerList.delete(channel)
  }

  app.on('window-all-closed', () => remove())

  return remove
}

/**
 * 批量注册 handler
 * @param arr TIPCMethods数组
 * @returns 返回一个取消注册函数数组
 */
export function batchRegisterHandlers(arr: TIPCMethods[]) {
  return arr.map(item => registerHandler(item))
}

/** 创建发送 IPC 消息的函数 */
export function createSender<T extends TIPCMethods>(win: BrowserWindow, proto: T): T['methods'] {
  const initial = {} as T['methods']
  const { name, methods } = proto

  Object.keys(methods).reduce((acc, methodName) => {
    if (methods[methodName] !== Method)
      return acc;

    (acc as any)[methodName] = (...args: any[]) =>
      win.webContents.send(formatChannelName(name, methodName), ...args)

    return acc
  }, initial)

  return initial
}
