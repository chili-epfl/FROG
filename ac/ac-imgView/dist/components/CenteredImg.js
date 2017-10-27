'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _frogUtils = require('frog-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CenteredImgComp = function CenteredImgComp(_ref) {
  var url = _ref.url;
  return _react2.default.createElement(_frogUtils.ImageReload, {
    alt: '',
    src: url,
    style: {
      position: 'absolute',
      maxWidth: '100%',
      maxHeight: '100%',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '5%'
    }
  });
};

CenteredImgComp.displayName = 'CenteredImg';
exports.default = CenteredImgComp;