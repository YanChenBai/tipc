import { BrowserWindow, ipcMain } from 'electron'
import { TIPC_HANDLER } from './common'

type Func = (...args: any[]) => void

interface HandleMeta {
  event: Electron.IpcMainInvokeEvent
  win: Electron.BrowserWindow | null
}

type ConvertHandles<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: (meta: HandleMeta, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}

interface TipcSchema {
  handles: Record<string, Func>
  listeners: Record<string, Func>
}

const joinName = (...args: string[]) => args.join(':')

const handleSet = new Set<string>()

export function useTipc<T extends TipcSchema>(name: string, handles: ConvertHandles<T['handles']>) {
  const channel = joinName(TIPC_HANDLER, name)

  async function handle(
    event: Electron.IpcMainInvokeEvent,
    { method, args }: {
      method: string
      args: any[]
    },
  ) {
    const func: Func = handles[method]

    if (!func)
      throw new Error(`Method '${method}' not registered`)

    try {
      const win = BrowserWindow.fromId(event.sender.id)
      return await Promise.resolve(func({ event, win }, ...args))
    }
    catch (error) {
      console.error(`[${channel}] Error in ${method}:`, error)
      throw error
    }
  }

  function init() {
    if (handleSet.has(channel))
      return

    handleSet.add(channel)

    ipcMain.handle(channel, handle)
  }

  function off() {
    ipcMain.removeHandler(channel)
    handleSet.delete(channel)
  }

  function sender(win: BrowserWindow) {
    return new Proxy({} as T['listeners'], {
      get(_target, method) {
        return (...args: any[]) => {
          win.webContents.send(joinName(channel, method.toString()), ...args)
        }
      },
    })
  }

  return { off, sender, init }
}
