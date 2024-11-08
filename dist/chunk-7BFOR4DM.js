// src/common.ts
var INVOKE_CHANNEL = "TIPC:INVOKE";
function formatChannelName(...args) {
  return `TIPC|${args.join("_")}`;
}
var Method = Object;

export {
  INVOKE_CHANNEL,
  formatChannelName,
  Method
};
