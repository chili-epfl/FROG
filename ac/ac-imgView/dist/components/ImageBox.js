'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: relative;\n  border: none;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n'], ['\n  position: relative;\n  border: none;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _CenteredImg = require('./CenteredImg');

var _CenteredImg2 = _interopRequireDefault(_CenteredImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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
  }[styleCode] || { border: 'solid 2px #a0a0a0' };
};

var ImgButton = _styledComponents2.default.button(_templateObject);

var ImageBox = function ImageBox(_ref) {
  var image = _ref.image,
      onClick = _ref.onClick,
      styleCode = _ref.styleCode;
  return _react2.default.createElement(
    ImgButton,
    { onClick: onClick, style: getStyle(styleCode) },
    _react2.default.createElement(_CenteredImg2.default, { url: image.url })
  );
};

ImageBox.displayName = 'ImageBox';
exports.default = ImageBox;