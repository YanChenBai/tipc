import type { ConvertToHandlers, Obj, Req } from './type'

export { Method } from './common'

/**  用于创建Handler时辅助类型推断的工具函数 */
export function defineHandler<T extends Obj, R = ConvertToHandlers<T>>(handler: R | (() => R)) {
  return typeof handler === 'function' ? (handler as () => T)() : handler
}

export {
  ConvertToHandlers,
  Req,
}
