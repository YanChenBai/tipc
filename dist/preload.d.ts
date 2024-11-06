import { I as Invoke, O as Obj, L as Listener } from './type-C2ttT2qB.js';
export { TIpcFunc } from './renderer.js';
import 'electron';

declare function exposeInvoke(invoke: Invoke, props: Obj): Record<string, any>;
declare function exposeListener<T extends Obj>(listener: Listener): () => <K extends keyof T>(method: K, callback: (...args: any[]) => void) => void;

export { exposeInvoke, exposeListener };
