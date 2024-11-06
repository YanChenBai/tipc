import { O as Obj, b as ObjectToHandler } from './type-CqIQC4Q3.js';
export { F as Func, R as Req } from './type-CqIQC4Q3.js';
import { BrowserWindow } from 'electron';

declare function registerHandler(win: BrowserWindow, handlers: Obj): void;
declare function createSender<T extends Obj>(win: BrowserWindow, props: T): T;
declare function initTIPC(): void;
declare function defineHandler<T extends Obj, R = ObjectToHandler<T>>(handler: R | (() => R)): T | R;

export { Obj, ObjectToHandler, createSender, defineHandler, initTIPC, registerHandler };
