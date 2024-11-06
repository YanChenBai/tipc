import {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  formatChannelName
} from "./chunk-NZWGKPNT.js";

// src/preload.ts
import { ipcRenderer } from "electron";
function getInvokes(invoke, channel, props) {
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Function)
      acc[methodName] = (...args) => invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeInvoke(invoke, props) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  return getInvokes(invoke, formatChannelName(id, INVOKE_CHANNEL), props);
}
function exposeListener(listener) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  return () => (method, callback) => {
    listener(formatChannelName(id, String(method)), (...args) => callback(...args));
  };
}
export {
  exposeInvoke,
  exposeListener
};
