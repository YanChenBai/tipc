import type { AnyFn, FnMap } from './type'
import { BrowserWindow, ipcMain } from 'electron'
import { TIPC_HANDLER, TIPC_LISTENER } from './common'

interface HandleMeta {
  event: Electron.IpcMainInvokeEvent
  win: Electron.BrowserWindow | null
}

type ConvertHandles<T extends FnMap> = {
  [K in keyof T]: (meta: HandleMeta, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}

type ConvertListener<T extends FnMap> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => void
}

interface TipcSchema {
  name: string
  handlers: FnMap
  listeners: FnMap
}

export const joinName = (...args: string[]) => args.join(':')

const handleSet = new Set<string>()

export function useTipc<
  T extends TipcSchema = TipcSchema,
  Handles extends FnMap = T['handlers'],
  Listener extends FnMap = T['listeners'],
>(schema: T, handles: ConvertHandles<Handles>) {
  const name = schema.name
  const channel = joinName(TIPC_HANDLER, name)

  async function handle(
    event: Electron.IpcMainInvokeEvent,
    { method, args }: {
      method: string
      args: any[]
    },
  ) {
    const func: AnyFn = handles[method]

    if (!func)
      throw new Error(`Method '${method}' is nonexistent.`)

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

  function createSender(win: BrowserWindow) {
    return new Proxy({}, {
      get(_target, method) {
        return (...args: any[]) => {
          win.webContents.send(joinName(TIPC_LISTENER, name, method.toString()), ...args)
        }
      },
    }) as ConvertListener<Listener>
  }

  return {
    off,
    init,
    createSender,
  }
}

export function getAllTipc() {
  return handleSet
}

export function clearAllTipc() {
  for (const channel of handleSet) {
    ipcMain.removeHandler(channel)
  }
  handleSet.clear()
}
