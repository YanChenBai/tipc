"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkJFFF62F3cjs = require('./chunk-JFFF62F3.cjs');

// src/index.ts
var _electron = require('electron');
function registerHandler(win, handlers) {
  const name = _chunkJFFF62F3cjs.formatChannelName.call(void 0, win.id, _chunkJFFF62F3cjs.INVOKE_CHANNEL);
  _electron.ipcMain.handle(_chunkJFFF62F3cjs.formatChannelName.call(void 0, win.id, _chunkJFFF62F3cjs.INVOKE_CHANNEL), async (event, method, ...args) => {
    const func = handlers[method];
    try {
      if (!func)
        throw new Error(`${name} channel: method ${method} not found.`);
      if (typeof func !== "function")
        throw new Error(`${name} channel: method ${method} is not a function.`);
      const win2 = _electron.BrowserWindow.getAllWindows().find((i) => i.id === event.sender.id);
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
      acc[methodName] = (...args) => win.webContents.send(_chunkJFFF62F3cjs.formatChannelName.call(void 0, win.id, methodName), ...args);
    }
    return acc;
  }, initial);
}
function initTIPC() {
  _electron.ipcMain.on(_chunkJFFF62F3cjs.GET_WIN_ID_CHANNEL, (event) => event.returnValue = event.sender.id);
}
function defineHandler(handler) {
  return typeof handler === "function" ? handler() : handler;
}





exports.createSender = createSender; exports.defineHandler = defineHandler; exports.initTIPC = initTIPC; exports.registerHandler = registerHandler;
