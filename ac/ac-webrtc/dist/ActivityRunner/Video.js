"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var src = _ref.src,
      self = _ref.self;
  return _react.default.createElement("video", {
    playsInline: true,
    id: "localVideo",
    autoPlay: true,
    muted: self,
    src: src,
    height: "100%",
    width: "100%"
  });
};

exports.default = _default;