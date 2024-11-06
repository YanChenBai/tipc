"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkEQERPM4Qcjs = require('./chunk-EQERPM4Q.cjs');

// src/index.ts
var _electron = require('electron');
function registerHandler(win, handlers) {
  const name = _chunkEQERPM4Qcjs.formatChannelName.call(void 0, win.id, _chunkEQERPM4Qcjs.INVOKE_CHANNEL);
  _electron.ipcMain.handle(_chunkEQERPM4Qcjs.formatChannelName.call(void 0, win.id, _chunkEQERPM4Qcjs.INVOKE_CHANNEL), (event, method, ...args) => _chunkEQERPM4Qcjs.__async.call(void 0, this, null, function* () {
    const func = handlers[method];
    try {
      if (!func)
        throw new Error(`${name} channel: method ${method} not found.`);
      if (typeof func !== "function")
        throw new Error(`${name} channel: method ${method} is not a function.`);
      const win2 = _electron.BrowserWindow.getAllWindows().find((i) => i.id === event.sender.id);
      const result = yield Promise.resolve(func({ event, win: win2 }, ...args));
      return result;
    } catch (error) {
      console.error(String(error));
    }
  }));
}
function createSender(win, props) {
  const initial = {};
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (typeof method === "function") {
      acc[methodName] = (...args) => win.webContents.send(_chunkEQERPM4Qcjs.formatChannelName.call(void 0, win.id, methodName), ...args);
    }
    return acc;
  }, initial);
}
function initTIPC() {
  _electron.ipcMain.on(_chunkEQERPM4Qcjs.GET_WIN_ID_CHANNEL, (event) => event.returnValue = event.sender.id);
}




exports.createSender = createSender; exports.initTIPC = initTIPC; exports.registerHandler = registerHandler;
