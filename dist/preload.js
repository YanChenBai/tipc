import {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  TIpcFunc,
  formatChannelName
} from "./chunk-ACED7LHG.js";

// src/preload.ts
import { ipcRenderer } from "electron";
function exposeInvoke(props) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  const channel = formatChannelName(id, INVOKE_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function)
      acc[methodName] = (...args) => ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
var listener = (channel, cb) => ipcRenderer.on(channel, (_e, ...args) => cb(...args));
function exposeListener(props) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function) {
      acc[methodName] = (cb) => {
        listener(formatChannelName(id, methodName), (...args) => cb(...args));
      };
    }
    return acc;
  }, {});
}
export {
  TIpcFunc,
  exposeInvoke,
  exposeListener
};
