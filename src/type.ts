import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'

export type Func = (...args: any[]) => any
export type Obj = Record<string, any>
export interface Req {
  event: IpcMainInvokeEvent
  win: BrowserWindow
}

/** 忽略函数的第一参数  */
type OmitFirstParam<F, T> = F extends (arg1: infer Q, ...args: infer P) => infer R
  ? Q extends T
    ? (...args: P) => R
    : F
  : F

/** 排除函数的 Invoke Event 参数 */
type OmitInvokeEvent<T> = {
  [K in keyof T]: T[K] extends Func
    ? OmitFirstParam<T[K], IpcMainInvokeEvent>
    : T[K] extends Obj ? OmitInvokeEvent<T[K]> : T[K]
}

/** 排除非函数的属性 */
type OmitNonFunc<T> = {
  [K in keyof T as T[K] extends Func ? K : never]: T[K]
}

type GetExposeInvokes<T extends Obj> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> extends Promise<any>
    ? ReturnType<T[K]>
    : Promise<ReturnType<T[K]>>
}

// 获取主进程暴露的方法类型
export type ExposeInvokes<T extends Obj> = GetExposeInvokes<OmitInvokeEvent<OmitNonFunc<T>>>

// 获取渲染进程监听器的类型
export type ExposeListeners<T extends Obj> = OmitNonFunc<{
  [K in keyof T]: (callback: (...args: Parameters<T[K]>) => void) => () => void
}>

export type ConvertToHandlers<T extends Obj> = OmitNonFunc<{
  [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>
}>
