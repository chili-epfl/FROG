"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _frogUtils = require("frog-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var actionTypes = ['dragdrop-upload', 'webcam-upload', 'vote', 'zoom'];

var Viewer = function Viewer(_ref) {
  var state = _ref.state;
  return _react.default.createElement("div", null, state.map(function (d, i) {
    return _react.default.createElement(_frogUtils.CountChart, {
      key: actionTypes[i],
      title: 'Number of ' + actionTypes[i] + ' per group',
      vAxis: 'Number of ' + actionTypes[i],
      hAxis: "Number of groups",
      categories: ['0', '1', '2', '3', '4', '>4'],
      data: d
    });
  }));
};

var prepareDataForDisplay = function prepareDataForDisplay(state) {
  return state && actionTypes.map(function (actionType) {
    return Object.keys(state).reduce(function (acc, val) {
      var count = state[val] ? state[val][actionType] : -1;

      if (Number.isInteger(count) && count > -1) {
        acc[Math.min(Math.max(0, count), 5)] += 1;
      }

      return acc;
    }, [0, 0, 0, 0, 0, 0]);
  });
};

var mergeLog = function mergeLog(state, log) {
  var action = log.type;

  if (actionTypes.includes(action)) {
    if (!state[log.instanceId]) {
      state[log.instanceId] = actionTypes.reduce(function (acc, i) {
        return _objectSpread({}, acc, _defineProperty({}, i, 0));
      }, {});
    }

    state[log.instanceId][action] += 1;
  }
};

var initData = {};
var _default = {
  dashboard: {
    Viewer: Viewer,
    mergeLog: mergeLog,
    initData: initData,
    prepareDataForDisplay: prepareDataForDisplay
  }
};
exports.default = _default;