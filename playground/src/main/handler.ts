import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import type { ObjectToHandler } from 'tipc'
import type { ICommonHandler } from '../commons/handler/commonHandler'

export class CommonHandler implements ObjectToHandler<ICommonHandler> {
  minimize(_event: IpcMainInvokeEvent, win: BrowserWindow) {
    win.minimize()
  }
}
