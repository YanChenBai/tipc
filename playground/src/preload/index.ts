import { exposeInvoke, exposeListener } from '@byc/tipc/preload'
import { contextBridge } from 'electron'
import { CommonHandlerProto, CommonListenerProto } from '../commons/tipc/common'

contextBridge.exposeInMainWorld('invoke', exposeInvoke(CommonHandlerProto))
contextBridge.exposeInMainWorld('listener', exposeListener(CommonListenerProto))
