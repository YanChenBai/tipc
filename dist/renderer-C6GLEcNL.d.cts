import { IpcMainInvokeEvent, BrowserWindow } from 'electron';

type Func = (...args: any[]) => any;
type Obj = Record<string, any>;
interface Req {
    event: IpcMainInvokeEvent;
    win: BrowserWindow;
}
/** 忽略函数的第一参数  */
type OmitFirstParam<F, T> = F extends (arg1: infer Q, ...args: infer P) => infer R ? Q extends T ? (...args: P) => R : F : F;
/** 排除函数的 Invoke Event 参数 */
type OmitInvokeEvent<T> = {
    [K in keyof T]: T[K] extends Func ? OmitFirstParam<T[K], IpcMainInvokeEvent> : T[K] extends Obj ? OmitInvokeEvent<T[K]> : T[K];
};
/** 排除非函数的属性 */
type OmitNonFunc<T> = {
    [K in keyof T as T[K] extends Func ? K : never]: T[K];
};
type GetExposeInvokes<T extends Obj> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]> extends Promise<any> ? ReturnType<T[K]> : Promise<ReturnType<T[K]>>;
};
type ExposeInvokes<T extends Obj> = GetExposeInvokes<OmitInvokeEvent<OmitNonFunc<T>>>;
type ExposeListeners<T extends Obj> = OmitNonFunc<{
    [K in keyof T]: (callback: (...args: Parameters<T[K]>) => void) => () => void;
}>;
type ConvertToHandlers<T extends Obj> = OmitNonFunc<{
    [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>;
}>;

export type { ConvertToHandlers as C, ExposeInvokes as E, Obj as O, Req as R, ExposeListeners as a };
