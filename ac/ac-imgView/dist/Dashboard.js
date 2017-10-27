'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _frogUtils = require('frog-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Viewer = function Viewer(_ref) {
  var data = _ref.data;

  var d = data && Object.keys(data).reduce(function (acc, val) {
    var count = data[val] ? data[val].upload : -1;
    if (Number.isInteger(count) && count > -1) {
      acc[Math.min(Math.max(0, count), 5)] += 1;
    }
    return acc;
  }, [0, 0, 0, 0, 0, 0]);
  return _react2.default.createElement(_frogUtils.CountChart, {
    title: 'Number of submissions per group',
    vAxis: 'Number of submissions',
    hAxis: 'Number of groups',
    categories: ['0', '1', '2', '3', '4', '>4'],
    data: d
  });
};

var mergeLog = function mergeLog(data, dataFn, _ref2) {
  var instanceId = _ref2.instanceId,
      payload = _ref2.payload;

  if (!(data && data[instanceId])) {
    dataFn.objInsert({ upload: 0, vote: 0 }, [instanceId]);
  }
  dataFn.numIncr(1, [instanceId, payload]);
};

var initData = {};

exports.default = {
  Viewer: Viewer,
  mergeLog: mergeLog,
  initData: initData
};