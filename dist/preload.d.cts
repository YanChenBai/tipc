import { O as Obj } from './type-xznbSeye.cjs';
export { TIpcFunc } from './common.cjs';
import 'electron';

declare function exposeInvoke(props: Obj): Obj;
declare function exposeListener(props: Obj): Obj;

export { exposeInvoke, exposeListener };
