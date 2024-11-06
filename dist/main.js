import {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  Method,
  formatChannelName
} from "./chunk-UW2XBU3W.js";

// src/main.ts
import { BrowserWindow, ipcMain } from "electron";
function registerHandler(win, handler) {
  const channel = formatChannelName(win.id, INVOKE_CHANNEL);
  ipcMain.handle(channel, async (event, method, ...args) => {
    const func = handler[method];
    try {
      if (!func)
        throw new Error(`${channel} channel: method ${method} not found.`);
      if (typeof func !== "function")
        throw new Error(`${channel} channel: method ${method} is not a function.`);
      const win2 = BrowserWindow.getAllWindows().find((i) => i.id === event.sender.id);
      const result = await Promise.resolve(func({ event, win: win2 }, ...args));
      return result;
    } catch (error) {
      console.error(String(error));
    }
  });
  const remove = () => ipcMain.removeHandler(channel);
  win.on("closed", remove);
  return remove;
}
function batchRegisterHandlers(win, handlers) {
  return handlers.map((handler) => registerHandler(win, handler));
}
function createSender(win, props) {
  const initial = {};
  return Object.keys(props).reduce((acc, method) => {
    if (props[method] !== Method)
      return acc;
    acc[method] = (...args) => win.webContents.send(formatChannelName(win.id, method), ...args);
    return acc;
  }, initial);
}
function initTIPC() {
  const listener = (event) => event.returnValue = event.sender.id;
  ipcMain.on(GET_WIN_ID_CHANNEL, listener);
  return () => {
    ipcMain.removeListener(GET_WIN_ID_CHANNEL, listener);
  };
}
export {
  batchRegisterHandlers,
  createSender,
  initTIPC,
  registerHandler
};
