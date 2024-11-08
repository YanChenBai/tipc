import { IpcMainInvokeEvent, BrowserWindow } from 'electron';

type Func = (...args: any[]) => any;
type Methods = Record<string, Func>;
interface Req {
    event: IpcMainInvokeEvent;
    win: BrowserWindow;
}
interface TIPCMethods {
    name: string;
    methods: Methods;
}
/** 忽略函数的第一参数  */
type OmitFirstParam<F, T> = F extends (arg1: infer Q, ...args: infer P) => infer R ? Q extends T ? (...args: P) => R : F : F;
/** 排除函数的 Invoke Event 参数 */
type OmitInvokeEvent<T extends Methods> = {
    [K in keyof T]: T[K] extends Func ? OmitFirstParam<T[K], IpcMainInvokeEvent> : T[K];
};
/** 排除非函数的属性 */
type OmitNonFunc<T extends Methods> = {
    [K in keyof T]: T[K] extends Func ? T[K] : never;
};
type GetExposeInvokes<T extends Methods> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>>;
};
type ExposeInvokes<T extends TIPCMethods, M extends Methods = T['methods']> = GetExposeInvokes<OmitInvokeEvent<OmitNonFunc<M>>>;
type ExposeListeners<T extends TIPCMethods, M extends Methods = T['methods']> = OmitNonFunc<{
    [K in keyof M]: (callback: (...args: Parameters<M[K]>) => void) => () => void;
}>;
type ConvertToHandlers<T extends Methods> = OmitNonFunc<{
    [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>;
}>;

export type { ConvertToHandlers as C, ExposeInvokes as E, Methods as M, Req as R, TIPCMethods as T, ExposeListeners as a };
