'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  width: 100%;\n  height: 81px;\n  position: absolute;\n  bottom: 0;\n  background-color: white;\n'], ['\n  width: 100%;\n  height: 81px;\n  position: absolute;\n  bottom: 0;\n  background-color: white;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: 90%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  padding-top: 10px;\n'], ['\n  height: 90%;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  padding-top: 10px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _UploadDragDrop = require('./UploadDragDrop');

var _UploadDragDrop2 = _interopRequireDefault(_UploadDragDrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var UploadBar = function UploadBar(props) {
  return _react2.default.createElement(
    Main,
    null,
    _react2.default.createElement('div', { style: { width: '100%', height: '1px', backgroundColor: 'black' } }),
    _react2.default.createElement(
      Container,
      null,
      _react2.default.createElement(_UploadDragDrop2.default, props),
      _react2.default.createElement(
        'div',
        { style: { width: '50%', display: 'flex', justifyContent: 'center' } },
        _react2.default.createElement(
          'button',
          {
            className: 'btn btn-secondary',
            onClick: function onClick() {
              return props.setWebcam(true);
            },
            style: { width: '50%', minWidth: 'fit-content' }
          },
          _react2.default.createElement(
            'h3',
            { style: { margin: 'auto' } },
            ' Open the webcam '
          )
        )
      )
    )
  );
};

var Main = _styledComponents2.default.div(_templateObject);

var Container = _styledComponents2.default.div(_templateObject2);

UploadBar.displayName = 'UploadBar';
exports.default = UploadBar;