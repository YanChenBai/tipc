import {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  Method,
  formatChannelName
} from "./chunk-UW2XBU3W.js";

// src/preload.ts
import { ipcRenderer } from "electron";
function exposeInvoke(props) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  const channel = formatChannelName(id, INVOKE_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Method)
      acc[methodName] = (...args) => ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeListener(props) {
  const id = ipcRenderer.sendSync(GET_WIN_ID_CHANNEL);
  return Object.keys(props).reduce((acc, methodName) => {
    const method = props[methodName];
    if (method === Method) {
      acc[methodName] = (cb) => {
        const channel = formatChannelName(id, methodName);
        const listener = (_e, ...args) => cb(...args);
        ipcRenderer.on(channel, listener);
        return () => {
          ipcRenderer.removeListener(channel, listener);
        };
      };
    }
    return acc;
  }, {});
}
export {
  exposeInvoke,
  exposeListener
};
