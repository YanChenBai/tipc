import type { IpcMainInvokeEvent } from 'electron'

export type Func = (...args: any[]) => any
type Obj = Record<string, any>

export type Invoke = (channel: string, ...args: any[]) => Promise<any>
export type Listener = (channel: string, callback: (...args: any[]) => void) => void

export interface IpcHandler {
  name: string
  handlers: Record<string, Func>
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

/** 函数返回结果转Promise */
type FuncToPromise<T extends Func> = T extends (...args: infer A) => infer R
  ? (...args: A) => R extends Promise<any> ? R : Promise<R> // 如果返回值就是Promise则直接返回
  : T

/** 函数返回值转Promise */
type MethodToPromise<T> = {
  [K in keyof T]: T[K] extends Func
    ? FuncToPromise<T[K]>
    : T[K] extends Obj ? MethodToPromise<T[K]> : T[K]
}

/** 排除非函数的属性 */
type OmitNonFunc<T> = {
  [K in keyof T as T[K] extends Func ? K : never]: T[K]
}

// 获取主进程暴露的方法类型
export type ExposeInvoke<T extends IpcHandler> = OmitInvokeEvent<MethodToPromise<OmitNonFunc<T['handlers']>>>

// 获取渲染进程监听器的类型
export type ExposeListener = <T extends Obj>() => <K extends keyof T = keyof T>(method: K, callback: (...args: Parameters<T[K]>) => void) => void

export {}
