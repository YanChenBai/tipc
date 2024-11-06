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
type GetExposeInvoke<T extends Obj> = <K extends keyof T = keyof T, R = ReturnType<T[K]>>(method: K, ...args: Parameters<T[K]>) => R extends Promise<any> ? R : Promise<R>;
type ExposeInvoke = <T extends Obj>() => GetExposeInvoke<OmitInvokeEvent<OmitNonFunc<T>>>;
type ExposeListener<T extends Obj> = OmitNonFunc<{
    [K in keyof T]: (callback: (...args: Parameters<T[K]>) => void) => void;
}>;
type ObjectToHandler<T extends Obj> = OmitNonFunc<{
    [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>;
}>;

export type { ExposeInvoke as E, Func as F, Obj as O, Req as R, ExposeListener as a, ObjectToHandler as b };
