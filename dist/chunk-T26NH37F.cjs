"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/common.ts
var GET_WIN_ID_CHANNEL = "TIPC:GET_WIN_ID";
var INVOKE_CHANNEL = "TIPC:INVOKE";
function formatChannelName(id, name) {
  return `TIPC:ID[${id}]:NAME[${name}]`;
}
var Method = Object;






exports.GET_WIN_ID_CHANNEL = GET_WIN_ID_CHANNEL; exports.INVOKE_CHANNEL = INVOKE_CHANNEL; exports.formatChannelName = formatChannelName; exports.Method = Method;
