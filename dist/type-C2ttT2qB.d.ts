import { IpcMainInvokeEvent, BrowserWindow } from 'electron';

type Func = (...args: any[]) => any;
type Obj = Record<string, any>;
interface Req {
    event: IpcMainInvokeEvent;
    win: BrowserWindow;
}
type Invoke = (channel: string, ...args: any[]) => Promise<any>;
type Listener = (channel: string, callback: (...args: any[]) => void) => void;
/** 排除非函数的属性 */
type OmitNonFunc<T> = {
    [K in keyof T as T[K] extends Func ? K : never]: T[K];
};
type ExposeListener = <T extends Obj>() => <K extends keyof T = keyof T>(method: K, callback: (...args: Parameters<T[K]>) => void) => void;
type ObjectToHandler<T extends Obj> = OmitNonFunc<{
    [K in keyof T]: (req: Req, ...args: Parameters<T[K]>) => ReturnType<T[K]>;
}>;

export type { ExposeListener as E, Func as F, Invoke as I, Listener as L, Obj as O, Req as R, ObjectToHandler as a };
