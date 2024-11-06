"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunk3XFRGB67cjs = require('./chunk-3XFRGB67.cjs');

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
  const id = _electron.ipcRenderer.sendSync(_chunk3XFRGB67cjs.GET_WIN_ID_CHANNEL);
  return getInvokes(invoke, _chunk3XFRGB67cjs.formatChannelName.call(void 0, id, _chunk3XFRGB67cjs.INVOKE_CHANNEL), props);
}
function exposeListener(listener) {
  const id = _electron.ipcRenderer.sendSync(_chunk3XFRGB67cjs.GET_WIN_ID_CHANNEL);
  return () => (method, callback) => {
    listener(_chunk3XFRGB67cjs.formatChannelName.call(void 0, id, String(method)), (...args) => callback(...args));
  };
}



exports.exposeInvoke = exposeInvoke; exports.exposeListener = exposeListener;
