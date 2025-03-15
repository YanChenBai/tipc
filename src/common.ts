export const TIPC_HANDLER = 'TIPC_HANDLER'
export const TIPC_LISTENER = 'TIPC_LISTENER'
export const TIPC_EXPOSE_NAME = 'tipc'
export const joinName = (...args: string[]) => args.join(':')

export abstract class PreloadExpose {
  abstract invoke(name: string, method: string, ...args: any[]): any
  abstract listener(name: string, method: string, cb: (...args: any[]) => void): any
}
