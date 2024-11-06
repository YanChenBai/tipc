import { O as Obj } from './renderer-C6GLEcNL.cjs';
import { BrowserWindow } from 'electron';

/**
 * 注册 handler
 * @param win 窗口实例
 * @param handler handler 对象
 * @returns 取消注册的方法
 */
declare function registerHandler(win: BrowserWindow, handler: Obj): () => void;
/**
 * 批量注册 handler
 * @param win 窗口对象
 * @param handlers handler 对象数组
 * @returns 返回一个取消注册函数数组
 */
declare function batchRegisterHandlers(win: BrowserWindow, handlers: Obj[]): (() => void)[];
/** 创建发送 IPC 消息的函数 */
declare function createSender<T extends Obj>(win: BrowserWindow, props: T): T;
/** 初始化 TIPC */
declare function initTIPC(): () => void;

export { batchRegisterHandlers, createSender, initTIPC, registerHandler };
