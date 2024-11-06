"use strict";Object.defineProperty(exports, "__esModule", {value: true});




var _chunkT26NH37Fcjs = require('./chunk-T26NH37F.cjs');

// src/preload.ts
var _electron = require('electron');
function exposeInvoke(props) {
  const id = _electron.ipcRenderer.sendSync(_chunkT26NH37Fcjs.GET_WIN_ID_CHANNEL);
  const channel = _chunkT26NH37Fcjs.formatChannelName.call(void 0, id, _chunkT26NH37Fcjs.INVOKE_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === _chunkT26NH37Fcjs.Method)
      acc[methodName] = (...args) => _electron.ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeListener(props) {
  const id = _electron.ipcRenderer.sendSync(_chunkT26NH37Fcjs.GET_WIN_ID_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === _chunkT26NH37Fcjs.Method) {
      acc[methodName] = (cb) => {
        const channel = _chunkT26NH37Fcjs.formatChannelName.call(void 0, id, methodName);
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
