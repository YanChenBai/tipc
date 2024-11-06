import { O as Obj } from './type-C2ttT2qB.js';
export { F as Func, I as Invoke, L as Listener, a as ObjectToHandler, R as Req } from './type-C2ttT2qB.js';
import { BrowserWindow } from 'electron';

declare function registerHandler(win: BrowserWindow, handlers: Obj): void;
declare function createSender<T extends Obj>(win: BrowserWindow, props: T): T;
declare function initTIPC(): void;

export { Obj, createSender, initTIPC, registerHandler };
