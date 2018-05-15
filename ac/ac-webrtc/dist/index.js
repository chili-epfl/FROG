"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _ActivityRunner = _interopRequireDefault(require("./ActivityRunner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meta = {
  name: 'WebRTC',
  shortDesc: 'Video Conference',
  description: 'Video conference using WebRTC peer to peer configuration',
  exampleData: [{
    title: 'Yourself',
    config: {
      title: 'Talk with yourself',
      sdpConstraints: {
        audio: true,
        video: true
      }
    },
    data: []
  }]
}; // default empty reactive datastructure, typically either an empty object or array

var dataStructure = []; // receives incoming data, and merges it with the reactive data using dataFn.*

var mergeFunction = function mergeFunction(object, dataFn) {
  if (object.data) {
    object.data.forEach(function (x) {
      return dataFn.listAppend(x);
    });
  }
};

var _default = {
  id: 'ac-webrtc',
  type: 'react-component',
  meta: meta,
  config: _config.default,
  ActivityRunner: _ActivityRunner.default,
  Dashboard: null,
  dataStructure: dataStructure,
  mergeFunction: mergeFunction
};
exports.default = _default;