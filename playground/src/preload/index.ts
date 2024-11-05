import { contextBridge, ipcRenderer } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc'
import { MainHandler } from '../main/handler'

contextBridge.exposeInMainWorld('api', {
  main: exposeInvoke(ipcRenderer.invoke, MainHandler),
})

contextBridge.exposeInMainWorld('createListener', exposeListener(
  (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_e, ...args: any[]) => cb(...args))
  },
))
