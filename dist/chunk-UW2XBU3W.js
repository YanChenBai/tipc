// src/common.ts
var GET_WIN_ID_CHANNEL = "TIPC:GET_WIN_ID";
var INVOKE_CHANNEL = "TIPC:INVOKE";
function formatChannelName(id, name) {
  return `TIPC:ID[${id}]:NAME[${name}]`;
}
var Method = Object;

export {
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  formatChannelName,
  Method
};
