import { contextBridge } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'
import { Common2HandlerMethods, CommonHandlerMethods, CommonListenerMethods } from '../commons/tipc/common'

contextBridge.exposeInMainWorld('invoke', exposeInvoke(CommonHandlerMethods))
contextBridge.exposeInMainWorld('invoke2', exposeInvoke(Common2HandlerMethods))
contextBridge.exposeInMainWorld('listener', exposeListener(CommonListenerMethods))
