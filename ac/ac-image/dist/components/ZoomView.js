"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mousetrap = _interopRequireDefault(require("mousetrap"));

var _frogUtils = require("frog-utils");

var _CenteredImg = _interopRequireDefault(require("./CenteredImg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  background: rgba(50, 50, 50, 0.8);\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ZoomContainer = _styledComponents.default.div(_templateObject());

var ZoomView = function ZoomView(_ref) {
  var close = _ref.close,
      images = _ref.images,
      setIndex = _ref.setIndex,
      index = _ref.index,
      commentBox = _ref.commentBox,
      dataFn = _ref.dataFn,
      logger = _ref.logger,
      commentGuidelines = _ref.commentGuidelines;

  _mousetrap.default.bind('left', function () {
    return setIndex(Math.max(index - 1, 0));
  });

  _mousetrap.default.bind('right', function () {
    return setIndex(Math.min(index + 1, images.length - 1));
  });

  return _react.default.createElement(ZoomContainer, null, _react.default.createElement(_CenteredImg.default, {
    url: images[index].url
  }), _react.default.createElement("button", {
    onClick: close,
    className: "btn btn-secondary",
    style: {
      position: 'absolute',
      right: '0px'
    }
  }, _react.default.createElement("span", {
    className: "glyphicon glyphicon-remove"
  })), commentBox && _react.default.createElement(_frogUtils.ReactiveText, {
    type: "textarea",
    path: [images[index].key, 'comment'],
    logger: logger,
    dataFn: dataFn,
    placeholder: commentGuidelines,
    style: {
      fontSize: '22px',
      position: 'absolute',
      width: '100%',
      height: '100px',
      bottom: '0px'
    }
  }), commentBox && _react.default.createElement("button", {
    onClick: close,
    className: "btn btn-success",
    style: {
      position: 'absolute',
      right: '0px',
      bottom: '0px',
      height: '100px',
      width: '100px'
    }
  }, _react.default.createElement("i", {
    className: "fa fa-check",
    style: {
      fontSize: 'xx-large'
    }
  })));
};

ZoomView.displayName = 'ZoomView';
var _default = ZoomView;
exports.default = _default;