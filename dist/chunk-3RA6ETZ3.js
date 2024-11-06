var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/common.ts
var GET_WIN_ID_CHANNEL = "TIPC:GET_WIN_ID";
var INVOKE_CHANNEL = "TIPC:INVOKE";
function formatChannelName(id, name) {
  return `TIPC:ID[${id}]:NAME[${name}]`;
}
var TIpcFunc = Function;

export {
  __async,
  GET_WIN_ID_CHANNEL,
  INVOKE_CHANNEL,
  formatChannelName,
  TIpcFunc
};
