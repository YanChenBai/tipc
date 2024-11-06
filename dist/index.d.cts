import { O as Obj } from './type-B7D03Yg-.cjs';
export { F as Func, a as ObjectToHandler, R as Req } from './type-B7D03Yg-.cjs';
import { BrowserWindow } from 'electron';

declare function registerHandler(win: BrowserWindow, handlers: Obj): void;
declare function createSender<T extends Obj>(win: BrowserWindow, props: T): T;
declare function initTIPC(): void;

export { Obj, createSender, initTIPC, registerHandler };
