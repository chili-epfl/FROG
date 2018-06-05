"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _fontAwesomeFiletypes = _interopRequireDefault(require("font-awesome-filetypes"));

var _CenteredImg = _interopRequireDefault(require("./CenteredImg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  border: none;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getStyle = function getStyle(styleCode) {
  return {
    chosen_by_team: {
      border: 'solid 4px #009900',
      borderRadius: '5px'
    },
    chosen_partially: {
      border: 'solid 4px #FFFF00',
      borderRadius: '5px'
    }
  }[styleCode] || {
    border: 'solid 2px #a0a0a0'
  };
};

var ImgButton = _styledComponents.default.button(_templateObject());

var ImageBox = function ImageBox(_ref) {
  var image = _ref.image,
      onClick = _ref.onClick,
      styleCode = _ref.styleCode;
  return _react.default.createElement(ImgButton, {
    onClick: onClick,
    style: getStyle(styleCode)
  }, image.thumbnail || !image.filename ? _react.default.createElement(_CenteredImg.default, {
    url: image.thumbnail || image.url
  }) : _react.default.createElement("span", null, _react.default.createElement("p", null, _react.default.createElement("i", {
    style: {
      fontSize: '120px'
    },
    className: 'fa ' + (0, _fontAwesomeFiletypes.default)(image.ext || ''),
    "aria-hidden": "true"
  })), image.filename));
};

ImageBox.displayName = 'ImageBox';
var _default = ImageBox;
exports.default = _default;