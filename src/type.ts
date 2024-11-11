import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'

export type Func = (...args: any[]) => any
export type Methods = Record<string, Func>
export interface Req {
  event: IpcMainInvokeEvent
  win: BrowserWindow
}

export interface TIPCMethods {
  name: string
  methods: Methods
}

/** 忽略函数的第一参数  */
 type OmitFirstParam<F, T> = F extends (arg1: infer Q, ...args: infer P) => infer R
   ? Q extends T
     ? (...args: P) => R
     : F
   : F

/** 排除函数的 Invoke Event 参数 */
type OmitInvokeEvent<T extends Methods> = {
  [K in keyof T]: T[K] extends Func
    ? OmitFirstParam<T[K], IpcMainInvokeEvent>
    : T[K]
}

/** 排除非函数的属性 */
type OmitNonFunc<T extends Methods> = {
  [K in keyof T]: T[K] extends Func ? T[K] : never
}

type GetExposeInvokes<T extends Methods> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> extends Promise<any>
    ? ReturnType<T[K]>
    : Promise<ReturnType<T[K]>>
}

// 获取主进程暴露的方法类型
export type ExposeInvokes<T extends TIPCMethods, M extends Methods = T['methods']> = GetExposeInvokes<
  OmitInvokeEvent<OmitNonFunc<M>>
>

// 获取渲染进程监听器的类型
export type ExposeListeners<T extends TIPCMethods, M extends Methods = T['methods']> = OmitNonFunc<{
  [K in keyof M]: (callback: (...args: Parameters<M[K]>) => void) => () => void
}>

export type ConvertToHandlers<T extends Methods> = OmitNonFunc<{
  [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}>
