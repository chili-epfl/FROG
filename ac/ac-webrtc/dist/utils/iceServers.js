"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ICEConfig = void 0;
var ICEConfig = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }, {
    urls: 'turn:138.197.182.1:3478',
    username: 'test',
    credential: 'test'
  }, {
    urls: 'stun:138.197.182.1:3478',
    username: 'test',
    credential: 'test'
  }]
};
exports.ICEConfig = ICEConfig;