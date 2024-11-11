import { exposeInvokes, exposeListeners } from '@byc/tipc/preload'
import { contextBridge } from 'electron'
import { CommonHandlerProto, CommonListenerProto } from '../commons/tipc/common'

contextBridge.exposeInMainWorld('invoke', exposeInvokes(CommonHandlerProto))
contextBridge.exposeInMainWorld('listener', exposeListeners(CommonListenerProto))
