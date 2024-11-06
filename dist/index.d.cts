import { O as Obj, C as ConvertToHandlers } from './renderer-C6GLEcNL.cjs';
export { R as Req } from './renderer-C6GLEcNL.cjs';
import 'electron';

declare const Method: ObjectConstructor;

/**  用于创建Handler时辅助类型推断的工具函数 */
declare function defineHandler<T extends Obj, R = ConvertToHandlers<T>>(handler: R | (() => R)): T | R;

export { ConvertToHandlers, Method, defineHandler };
