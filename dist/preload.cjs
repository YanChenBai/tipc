"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkJFFF62F3cjs = require('./chunk-JFFF62F3.cjs');

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
  const id = _electron.ipcRenderer.sendSync(_chunkJFFF62F3cjs.GET_WIN_ID_CHANNEL);
  return getInvokes(invoke, _chunkJFFF62F3cjs.formatChannelName.call(void 0, id, _chunkJFFF62F3cjs.INVOKE_CHANNEL), props);
}
function exposeListener(listener) {
  const id = _electron.ipcRenderer.sendSync(_chunkJFFF62F3cjs.GET_WIN_ID_CHANNEL);
  return () => (method, callback) => {
    listener(_chunkJFFF62F3cjs.formatChannelName.call(void 0, id, String(method)), (...args) => callback(...args));
  };
}




exports.TIpcFunc = _chunkJFFF62F3cjs.TIpcFunc; exports.exposeInvoke = exposeInvoke; exports.exposeListener = exposeListener;
