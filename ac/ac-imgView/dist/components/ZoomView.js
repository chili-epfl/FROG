'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  background: rgba(50, 50, 50, 0.8);\n'], ['\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  background: rgba(50, 50, 50, 0.8);\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _CenteredImg = require('./CenteredImg');

var _CenteredImg2 = _interopRequireDefault(_CenteredImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ZoomContainer = _styledComponents2.default.div(_templateObject);

var ZoomView = function ZoomView(_ref) {
  var close = _ref.close,
      images = _ref.images,
      setIndex = _ref.setIndex,
      index = _ref.index;

  _mousetrap2.default.bind('left', function () {
    return setIndex(Math.max(index - 1, 0));
  });
  _mousetrap2.default.bind('right', function () {
    return setIndex(Math.min(index + 1, images.length - 1));
  });

  return _react2.default.createElement(
    ZoomContainer,
    null,
    _react2.default.createElement(_CenteredImg2.default, { url: images[index].url }),
    _react2.default.createElement(
      'button',
      {
        onClick: close,
        className: 'btn btn-secondary',
        style: { position: 'absolute', right: '0px' }
      },
      _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
    )
  );
};

ZoomView.displayName = 'ZoomView';
exports.default = ZoomView;