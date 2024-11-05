import { contextBridge, ipcRenderer } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'

contextBridge.exposeInMainWorld('createInvoke', exposeInvoke(ipcRenderer.invoke))

contextBridge.exposeInMainWorld('createListener', exposeListener(
  (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_e, ...args: any[]) => cb(...args))
  },
))
