import type { ConvertToHandlers, Methods, Req, TIPCMethods } from './type'

export { Method } from './common'

/**  用于实现Handler时辅助类型推断的工具函数 */
export function defineHandler<T extends TIPCMethods, R extends Methods = ConvertToHandlers<T['methods']>>(proto: T, methods: R): TIPCMethods {
  return {
    name: proto.name,
    methods,
  }
}

export function defineProto<T extends Methods>(name: string, methods: T) {
  return {
    name,
    methods,
  }
}

export {
  ConvertToHandlers,
  Req,
}
