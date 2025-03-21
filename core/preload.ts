import type { PreloadExpose } from './common'
import { contextBridge, ipcRenderer } from 'electron'
import { joinName, TIPC_EXPOSE_NAME, TIPC_HANDLER, TIPC_LISTENER } from './common'

export const tipc: PreloadExpose = {
  invoke(name: string, method: string, ...args: any[]) {
    return ipcRenderer.invoke(joinName(TIPC_HANDLER, name), {
      method,
      args,
    })
  },

  listener(name: string, method: string, cb: (...args: any[]) => void) {
    const channel = joinName(TIPC_LISTENER, name, method)
    const _callback = (_event: Electron.IpcRendererEvent, args: any[]) => cb(args)
    ipcRenderer.addListener(channel, _callback)
    return () => ipcRenderer.removeListener(channel, _callback)
  },
}

export function exposeTipc() {
  contextBridge.exposeInMainWorld(TIPC_EXPOSE_NAME, tipc)
}
