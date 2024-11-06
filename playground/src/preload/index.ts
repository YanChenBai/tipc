import { contextBridge, ipcRenderer } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'
import { CommonHandlerMethods } from '../commons/handler/commonHandler'

contextBridge.exposeInMainWorld('invoke', exposeInvoke(ipcRenderer.invoke, CommonHandlerMethods))

contextBridge.exposeInMainWorld('createListener', exposeListener(
  (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_e, ...args: any[]) => cb(...args))
  },
))
