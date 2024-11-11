"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkJHSIC6LVcjs = require('./chunk-JHSIC6LV.cjs');

// src/preload.ts
var _electron = require('electron');
function exposeInvoke(proto) {
  const { name, methods } = proto;
  const channel = _chunkJHSIC6LVcjs.formatChannelName.call(void 0, _chunkJHSIC6LVcjs.INVOKE_CHANNEL, name);
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName];
    if (method === _chunkJHSIC6LVcjs.Method)
      acc[methodName] = (...args) => _electron.ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeListener(proto) {
  const { name, methods } = proto;
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName];
    if (method === _chunkJHSIC6LVcjs.Method) {
      acc[methodName] = (cb) => {
        const channel = _chunkJHSIC6LVcjs.formatChannelName.call(void 0, name, methodName);
        const listener = (_e, ...args) => cb(...args);
        _electron.ipcRenderer.on(channel, listener);
        return () => {
          _electron.ipcRenderer.removeListener(channel, listener);
        };
      };
    }
    return acc;
  }, {});
}



exports.exposeInvoke = exposeInvoke; exports.exposeListener = exposeListener;
