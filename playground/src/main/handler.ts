import type { ObjectToHandler, Req } from 'tipc'
import type { ICommonHandler } from '../commons/handler/commonHandler'

export class CommonHandler implements ObjectToHandler<ICommonHandler> {
  minimize(req: Req) {
    req.win.minimize()
  }
}
