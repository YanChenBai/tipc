"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkJHSIC6LVcjs = require('./chunk-JHSIC6LV.cjs');

// src/main.ts
var _electron = require('electron');
var registerList = /* @__PURE__ */ new Set();
function registerHandler(comply) {
  const { methods, name } = comply;
  const channel = _chunkJHSIC6LVcjs.formatChannelName.call(void 0, _chunkJHSIC6LVcjs.INVOKE_CHANNEL, name);
  if (registerList.has(channel))
    return;
  _electron.ipcMain.handle(channel, async (event, methodName, ...args) => {
    const func = methods[methodName];
    try {
      if (!func)
        throw new Error(`${channel} channel: method ${methodName} not found.`);
      if (typeof func !== "function")
        throw new Error(`${channel} channel: method ${methodName} is not a function.`);
      const win = _electron.BrowserWindow.fromId(event.sender.id);
      const result = await Promise.resolve(func({ event, win }, ...args));
      return result;
    } catch (error) {
      console.error(String(error));
    }
  });
  registerList.add(channel);
  const remove = () => {
    _electron.ipcMain.removeHandler(channel);
    registerList.delete(channel);
  };
  _electron.app.on("window-all-closed", () => remove());
  return remove;
}
function batchRegisterHandlers(arr) {
  return arr.map((item) => registerHandler(item));
}
function createSender(win, proto) {
  const initial = {};
  const { name, methods } = proto;
  Object.keys(methods).reduce((acc, methodName) => {
    if (methods[methodName] !== _chunkJHSIC6LVcjs.Method)
      return acc;
    acc[methodName] = (...args) => win.webContents.send(_chunkJHSIC6LVcjs.formatChannelName.call(void 0, name, methodName), ...args);
    return acc;
  }, initial);
  return initial;
}




exports.batchRegisterHandlers = batchRegisterHandlers; exports.createSender = createSender; exports.registerHandler = registerHandler;
