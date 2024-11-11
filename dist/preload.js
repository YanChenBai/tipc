import {
  INVOKE_CHANNEL,
  Method,
  formatChannelName
} from "./chunk-7BFOR4DM.js";

// src/preload.ts
import { ipcRenderer } from "electron";
function exposeInvoke(proto) {
  const { name, methods } = proto;
  const channel = formatChannelName(INVOKE_CHANNEL, name);
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName];
    if (method === Method)
      acc[methodName] = (...args) => ipcRenderer.invoke(channel, methodName, ...args);
    return acc;
  }, {});
}
function exposeListener(proto) {
  const { name, methods } = proto;
  return Object.keys(methods).reduce((acc, methodName) => {
    const method = methods[methodName];
    if (method === Method) {
      acc[methodName] = (cb) => {
        const channel = formatChannelName(name, methodName);
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
