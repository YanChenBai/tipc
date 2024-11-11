import { T as TIPCMethods, M as Methods } from './renderer-B6_0b9dR.js';
import 'electron';

/** 暴露主进程的 IPC 调用方法 */
declare function exposeInvoke(proto: TIPCMethods): Methods;
/** 暴露渲染进程的 IPC 监听函数 */
declare function exposeListener(proto: TIPCMethods): Methods;

export { exposeInvoke, exposeListener };
