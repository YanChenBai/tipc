import {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  formatChannelName
} from "./chunk-ACED7LHG.js";

// src/index.ts
import { BrowserWindow, ipcMain } from "electron";
function registerHandler(win, handlers) {
  const name = formatChannelName(win.id, INVOKE_CHANNEL);
  ipcMain.handle(formatChannelName(win.id, INVOKE_CHANNEL), async (event, method, ...args) => {
    const func = handlers[method];
    try {
      if (!func)
        throw new Error(`${name} channel: method ${method} not found.`);
      if (typeof func !== "function")
        throw new Error(`${name} channel: method ${method} is not a function.`);
      const win2 = BrowserWindow.getAllWindows().find((i) => i.id === event.sender.id);
      const result = await Promise.resolve(func({ event, win: win2 }, ...args));
      return result;
    } catch (error) {
      console.error(String(error));
    }
  });
}
function createSender(win, props) {
  const initial = {};
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (typeof method === "function") {
      acc[methodName] = (...args) => win.webContents.send(formatChannelName(win.id, methodName), ...args);
    }
    return acc;
  }, initial);
}
function initTIPC() {
  ipcMain.on(GET_WIN_ID_CHANNEL, (event) => event.returnValue = event.sender.id);
}
export {
  createSender,
  initTIPC,
  registerHandler
};
