import { T as TIPCMethods, M as Methods, C as ConvertToHandlers } from './renderer-B6_0b9dR.cjs';
export { R as Req } from './renderer-B6_0b9dR.cjs';
import 'electron';

declare const Method: ObjectConstructor;

/**  用于实现Handler时辅助类型推断的工具函数 */
declare function defineHandler<T extends TIPCMethods, R extends Methods = ConvertToHandlers<T['methods']>>(proto: T, methods: R): TIPCMethods;
declare function defineProto<T extends Methods>(name: string, methods: T): {
    name: string;
    methods: T;
};

export { ConvertToHandlers, Method, defineHandler, defineProto };
