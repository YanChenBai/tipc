import { O as Obj, b as ObjectToHandler } from './type-xznbSeye.js';
export { F as Func, R as Req } from './type-xznbSeye.js';
import { BrowserWindow } from 'electron';

declare function registerHandler(win: BrowserWindow, handlers: Obj): string;
declare function createSender<T extends Obj>(win: BrowserWindow, props: T): T;
declare function initTIPC(): void;
declare function defineHandler<T extends Obj, R = ObjectToHandler<T>>(handler: R | (() => R)): T | R;

export { Obj, ObjectToHandler, createSender, defineHandler, initTIPC, registerHandler };
