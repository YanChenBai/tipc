"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkEQERPM4Qcjs = require('./chunk-EQERPM4Q.cjs');

// src/preload.ts
var _electron = require('electron');
function getInvokes(invoke, channel, props) {
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function)
      acc[methodName] = (...args) => invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeInvoke(invoke, props) {
  const id = _electron.ipcRenderer.sendSync(_chunkEQERPM4Qcjs.GET_WIN_ID_CHANNEL);
  return getInvokes(invoke, _chunkEQERPM4Qcjs.formatChannelName.call(void 0, id, _chunkEQERPM4Qcjs.INVOKE_CHANNEL), props);
}
function exposeListener(listener) {
  const id = _electron.ipcRenderer.sendSync(_chunkEQERPM4Qcjs.GET_WIN_ID_CHANNEL);
  return () => (method, callback) => {
    listener(_chunkEQERPM4Qcjs.formatChannelName.call(void 0, id, String(method)), (...args) => callback(...args));
  };
}




exports.TIpcFunc = _chunkEQERPM4Qcjs.TIpcFunc; exports.exposeInvoke = exposeInvoke; exports.exposeListener = exposeListener;
