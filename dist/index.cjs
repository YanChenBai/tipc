"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkJHSIC6LVcjs = require('./chunk-JHSIC6LV.cjs');

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




exports.Method = _chunkJHSIC6LVcjs.Method; exports.defineHandler = defineHandler; exports.defineProto = defineProto;
