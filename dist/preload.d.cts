import { O as Obj } from './renderer-C6GLEcNL.cjs';
import 'electron';

/** 暴露主进程的 IPC 调用方法 */
declare function exposeInvoke(props: Obj): Obj;
/** 暴露渲染进程的 IPC 监听函数 */
declare function exposeListener(props: Obj): Obj;

export { exposeInvoke, exposeListener };
