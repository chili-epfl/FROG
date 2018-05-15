"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(_ref) {
  var activityData = _ref.activityData;
  return _react.default.createElement("div", null, _react.default.createElement("h1", null, activityData.config.title), _react.default.createElement("p", null, activityData.config.info));
};

exports.default = _default;