"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string'
    },
    info: {
      type: 'string',
      title: 'Information for your students:'
    },
    sdpConstraints: {
      type: 'object',
      properties: {
        audio: {
          title: 'Connect with audio input',
          type: 'boolean',
          default: true
        },
        video: {
          title: 'Connect using camera',
          type: 'boolean',
          default: true
        }
      }
    }
  }
};
exports.default = _default;