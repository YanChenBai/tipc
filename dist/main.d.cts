import { T as TIPCMethods } from './renderer-B6_0b9dR.cjs';
import { BrowserWindow } from 'electron';

/**
 * 注册 handler
 * @returns 取消注册的方法
 */
declare function registerHandler(comply: TIPCMethods): (() => void) | undefined;
/**
 * 批量注册 handler
 * @param arr TIPCMethods数组
 * @returns 返回一个取消注册函数数组
 */
declare function batchRegisterHandlers(arr: TIPCMethods[]): ((() => void) | undefined)[];
/** 创建发送 IPC 消息的函数 */
declare function createSender<T extends TIPCMethods>(win: BrowserWindow, proto: T): T['methods'];

export { batchRegisterHandlers, createSender, registerHandler };
