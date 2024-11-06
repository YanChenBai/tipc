import { contextBridge } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'
import { CommonHandlerMethods } from '../commons/handler/commonHandler'
import { CommonListenerMethods } from '../commons/listener/commonListener'

contextBridge.exposeInMainWorld('invoke', exposeInvoke(CommonHandlerMethods))

contextBridge.exposeInMainWorld('listener', exposeListener(CommonListenerMethods))
