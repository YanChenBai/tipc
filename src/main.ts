import type { IpcMainInvokeEvent } from 'electron'
import type { TIPCMethods } from './type'
import { app, BrowserWindow, ipcMain } from 'electron'
import { geListenerName, getHandlerName, Method } from './common'

export const deregisterMap = new Map<string, () => void>()

/**
 * 注册 handler
 * @returns 取消注册的方法
 */
export function registerHandler(comply: TIPCMethods) {
  const { methods, name } = comply
  const channel = getHandlerName(name)

  // 避免重复注册
  if (deregisterMap.has(channel))
    return deregisterMap.get(channel)!

  async function handler(event: IpcMainInvokeEvent, methodName: string, ...args: any[]) {
    const method = methods[methodName]

    if (!method)
      throw new Error(`[${channel}] Method '${methodName}' not registered`)

    if (typeof method !== 'function')
      throw new Error(`${channel} channel: method ${methodName} is not a function.`)

    const win = BrowserWindow.fromId(event.sender.id)
    const context = { event, win }

    try {
      return await Promise.resolve(method(context, ...args))
    }
    catch (error) {
      console.error(`[${channel}] Error in ${methodName}:`, error)
      throw error
    }
  }

  ipcMain.handle(channel, handler)

  // 清理函数
  const deregister = () => {
    ipcMain.removeHandler(channel)
    deregisterMap.delete(channel)
    app.off('window-all-closed', deregister)
  }

  // 保存清理方法
  deregisterMap.set(channel, deregister)

  // 窗口全部关闭时自动清理
  app.on('window-all-closed', deregister)

  return deregister
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
      win.webContents.send(geListenerName(name, methodName), ...args)

    return acc
  }, initial)

  return initial
}
