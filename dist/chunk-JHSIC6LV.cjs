"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common.ts
var INVOKE_CHANNEL = "TIPC:INVOKE";
function formatChannelName(...args) {
  return `TIPC|${args.join("_")}`;
}
var Method = Object;





exports.INVOKE_CHANNEL = INVOKE_CHANNEL; exports.formatChannelName = formatChannelName; exports.Method = Method;
