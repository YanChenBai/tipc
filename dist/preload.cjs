"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkJFFF62F3cjs = require('./chunk-JFFF62F3.cjs');

// src/preload.ts
var _electron = require('electron');
function exposeInvoke(props) {
  const id = _electron.ipcRenderer.sendSync(_chunkJFFF62F3cjs.GET_WIN_ID_CHANNEL);
  const channel = _chunkJFFF62F3cjs.formatChannelName.call(void 0, id, _chunkJFFF62F3cjs.INVOKE_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function)
      acc[methodName] = (...args) => _electron.ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
var listener = (channel, cb) => _electron.ipcRenderer.on(channel, (_e, ...args) => cb(...args));
function exposeListener(props) {
  const id = _electron.ipcRenderer.sendSync(_chunkJFFF62F3cjs.GET_WIN_ID_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function) {
      acc[methodName] = (cb) => {
        listener(_chunkJFFF62F3cjs.formatChannelName.call(void 0, id, methodName), (...args) => cb(...args));
      };
    }
    return acc;
  }, {});
}




exports.TIpcFunc = _chunkJFFF62F3cjs.TIpcFunc; exports.exposeInvoke = exposeInvoke; exports.exposeListener = exposeListener;
