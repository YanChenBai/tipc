import { I as Invoke, O as Obj, L as Listener } from './renderer-C2ttT2qB.cjs';
import 'electron';

declare function exposeInvoke(invoke: Invoke, props: Obj): Record<string, any>;
declare function exposeListener<T extends Obj>(listener: Listener): () => <K extends keyof T>(method: K, callback: (...args: any[]) => void) => void;

export { exposeInvoke, exposeListener };
