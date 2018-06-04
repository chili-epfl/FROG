"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DEFAULT_COMMENT_VALUE = void 0;

var _frogUtils = require("frog-utils");

var _lodash = require("lodash");

var _ActivityRunner = _interopRequireDefault(require("./ActivityRunner"));

var _Dashboard = _interopRequireDefault(require("./Dashboard"));

var _meta = require("./meta");

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_COMMENT_VALUE = '';
exports.DEFAULT_COMMENT_VALUE = DEFAULT_COMMENT_VALUE;
var dataStructure = {};

var mergeFunction = function mergeFunction(object, dataFn) {
  if (object.config.images) object.config.images.forEach(function (x, i) {
    return dataFn.objInsert(_objectSpread({
      votes: {},
      comment: DEFAULT_COMMENT_VALUE
    }, x), i);
  });
  if (object.data === null || object.data === {} || object.data === undefined) return;
  var dataImgs = Array.isArray(object.data) ? object.data : Object.keys(object.data).map(function (x) {
    return object.data[x];
  });
  dataImgs.forEach(function (x) {
    return dataFn.objInsert(_objectSpread({
      votes: {},
      categories: x.categories || x.category && [x.category],
      comment: DEFAULT_COMMENT_VALUE
    }, x), x.key || (0, _frogUtils.uuid)());
  });
};

var exportData = function exportData(configData, _ref) {
  var payload = _ref.payload;
  var csv = Object.keys(payload).reduce(function (acc, line) {
    var data = payload[line].data;
    return _toConsumableArray(acc).concat(_toConsumableArray((0, _lodash.compact)(Object.values(data).map(function (item) {
      return _typeof(item) === 'object' && item && item.key && [line, item.key, item.instanceId, JSON.stringify(item.comment), (0, _lodash.isEmpty)(item.categories) ? '' : JSON.stringify(item.categories), (0, _lodash.isEmpty)(item.votes) ? '' : JSON.stringify(item.votes)].join('\t');
    }))));
  }, []);
  var headers = ['instanceId', 'imageId', 'fromInstanceId', 'comment', 'categories', 'votes'].join('\t');
  return [headers].concat(_toConsumableArray(csv)).join('\n');
};

var _default = {
  id: 'ac-image',
  type: 'react-component',
  meta: _meta.meta,
  config: _config.config,
  configUI: _config.configUI,
  dataStructure: dataStructure,
  mergeFunction: mergeFunction,
  ActivityRunner: _ActivityRunner.default,
  dashboards: _Dashboard.default,
  exportData: exportData
};
exports.default = _default;