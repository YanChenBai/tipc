import { contextBridge, ipcRenderer } from 'electron'
import { joinName, TIPC_HANDLER, TIPC_LISTENER } from './common'

function invoke(name: string, method: string, ...args: any[]) {
  return ipcRenderer.invoke(joinName(TIPC_HANDLER, name), {
    method,
    args,
  })
}

function listener(name: string, method: string, callback: (...args: any[]) => any) {
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
