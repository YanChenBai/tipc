import { contextBridge } from 'electron'
import { exposeInvoke, exposeListener } from 'tipc/preload'
import { CommonHandlerProps, CommonListenerProps } from '../commons/tipc/common'

contextBridge.exposeInMainWorld('invoke', exposeInvoke(CommonHandlerProps))
contextBridge.exposeInMainWorld('listener', exposeListener(CommonListenerProps))
