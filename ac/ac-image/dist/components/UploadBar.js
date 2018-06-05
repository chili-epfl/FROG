"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _UploadDragDrop = _interopRequireDefault(require("./UploadDragDrop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  height: 90%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  padding-top: 10px;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  height: 81px;\n  position: absolute;\n  bottom: 0;\n  background-color: white;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var UploadBar = function UploadBar(props) {
  return _react.default.createElement(Main, null, _react.default.createElement("div", {
    style: {
      width: '100%',
      height: '1px',
      backgroundColor: 'black'
    }
  }), _react.default.createElement(Container, null, _react.default.createElement(_UploadDragDrop.default, props), _react.default.createElement("div", {
    style: {
      width: '50%',
      display: 'flex',
      justifyContent: 'center'
    }
  }, _react.default.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return props.setWebcam(true);
    },
    style: {
      width: '50%',
      minWidth: 'fit-content'
    }
  }, _react.default.createElement("h3", {
    style: {
      margin: 'auto'
    }
  }, " Open the webcam ")))));
};

var Main = _styledComponents.default.div(_templateObject());

var Container = _styledComponents.default.div(_templateObject2());

UploadBar.displayName = 'UploadBar';
var _default = UploadBar;
exports.default = _default;