import { BrowserWindow, contextBridge, ipcMain, ipcRenderer } from 'electron'

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

const TIPC_HANDLER = 'TIPC_HANDLER'
const TIPC_LISTENER = 'TIPC_LISTENER'

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

// Preload Start

function invoke(name: string, method: string, ...args: any[]) {
  return ipcRenderer.invoke(joinName(TIPC_HANDLER, name), {
    method,
    args,
  })
}

function listener(name: string, method: string, callback: Func) {
  const channel = joinName(TIPC_LISTENER, name, method)
  const _callback = (_event: Electron.IpcRendererEvent, args: any[]) => callback(args)

  ipcRenderer.on(channel, _callback)
  return () => ipcRenderer.removeListener(channel, _callback)
}

const TIPC_EXPOSE_NAME = 'tipc'

export function exposeTipc() {
  contextBridge.exposeInMainWorld(TIPC_EXPOSE_NAME, {
    invoke,
    listener,
  })
}

// Preload End
export interface TipcExpose {
  invoke: object
  listener: object
}

function proxyInvoke() {
  const _invoke = window[TIPC_EXPOSE_NAME].invoke
  window[TIPC_EXPOSE_NAME].invoke = new Proxy(_invoke, {
    get(_target, name) {
      return new Proxy(() => {}, {
        get(_target, method) {
          return (...args: any[]) => {
            return invoke(name.toString(), method.toString(), ...args)
          }
        },
      })
    },
  }) as TipcExpose['invoke']
}

function proxyListener() {
  const _listener = window[TIPC_EXPOSE_NAME].listener
  window[TIPC_EXPOSE_NAME].listener = new Proxy(_listener, {
    get(_target, name) {
      return new Proxy(() => {}, {
        get(_target, method) {
          return (callback: Func) => {
            return listener(name.toString(), method.toString(), callback)
          }
        },
      })
    },
  }) as TipcExpose['listener']
}

export function iniTipc() {
  proxyInvoke()
  proxyListener()
}
