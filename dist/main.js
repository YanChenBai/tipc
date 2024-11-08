import {
  INVOKE_CHANNEL,
  Method,
  formatChannelName
} from "./chunk-7BFOR4DM.js";

// src/main.ts
import { app, BrowserWindow, ipcMain } from "electron";
var registerList = /* @__PURE__ */ new Set();
function registerHandler(comply) {
  const { methods, name } = comply;
  const channel = formatChannelName(INVOKE_CHANNEL, name);
  if (registerList.has(channel))
    return;
  ipcMain.handle(channel, async (event, methodName, ...args) => {
    const func = methods[methodName];
    try {
      if (!func)
        throw new Error(`${channel} channel: method ${methodName} not found.`);
      if (typeof func !== "function")
        throw new Error(`${channel} channel: method ${methodName} is not a function.`);
      const win = BrowserWindow.fromId(event.sender.id);
      const result = await Promise.resolve(func({ event, win }, ...args));
      return result;
    } catch (error) {
      console.error(String(error));
    }
  });
  registerList.add(channel);
  const remove = () => {
    ipcMain.removeHandler(channel);
    registerList.delete(channel);
  };
  app.on("window-all-closed", () => remove());
  return remove;
}
function batchRegisterHandlers(arr) {
  return arr.map((item) => registerHandler(item));
}
function createSender(win, proto) {
  const initial = {};
  const { name, methods } = proto;
  Object.keys(methods).reduce((acc, methodName) => {
    if (methods[methodName] !== Method)
      return acc;
    acc[methodName] = (...args) => win.webContents.send(formatChannelName(name, methodName), ...args);
    return acc;
  }, initial);
  return initial;
}
export {
  batchRegisterHandlers,
  createSender,
  registerHandler
};
