import {
  Method
} from "./chunk-7BFOR4DM.js";

// src/index.ts
function defineHandler(proto, methods) {
  return {
    name: proto.name,
    methods
  };
}
function defineProto(name, methods) {
  return {
    name,
    methods
  };
}
export {
  Method,
  defineHandler,
  defineProto
};
