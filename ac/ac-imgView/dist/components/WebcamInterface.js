'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  background: rgba(50, 50, 50, 0.8);\n'], ['\n  position: absolute;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  background: rgba(50, 50, 50, 0.8);\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactWebcam = require('react-webcam');

var _reactWebcam2 = _interopRequireDefault(_reactWebcam);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var WebcamCapture = function WebcamCapture(_ref) {
  var setWebcam = _ref.setWebcam,
      uploadFn = _ref.uploadFn,
      data = _ref.data,
      dataFn = _ref.dataFn;

  var webcam = { getScreenshot: function getScreenshot() {
      return null;
    } };
  _mousetrap2.default.bind('esc', function () {
    return setWebcam(false);
  });
  return _react2.default.createElement(
    WebcamContainer,
    null,
    _react2.default.createElement(_reactWebcam2.default, {
      audio: false,
      ref: function ref(node) {
        return webcam = node;
      },
      style: { width: '60%', height: '90%', margin: 'auto' }
    }),
    _react2.default.createElement(
      'button',
      {
        className: 'btn btn-primary',
        onClick: function onClick() {
          var dataURL = webcam.getScreenshot();
          var file = dataURL;
          uploadFn(file, function (url) {
            // setTimeout, otherwise HTTP request sends back code 503
            setTimeout(function () {
              return dataFn.objInsert({ url: url, votes: {} }, Object.keys(data).length);
            }, 1000);
          });
          setWebcam(false);
        },
        style: {
          height: '100px',
          marginTop: 'auto',
          marginBottom: 'auto',
          marginRight: 'auto'
        }
      },
      'Take a picture'
    ),
    _react2.default.createElement(
      'button',
      {
        onClick: function onClick() {
          return setWebcam(false);
        },
        className: 'btn btn-secondary',
        style: { position: 'absolute', right: '0px' }
      },
      _react2.default.createElement('span', { className: 'glyphicon glyphicon-remove' })
    )
  );
};

WebcamCapture.displayName = 'WebcamCapture';
exports.default = WebcamCapture;


var WebcamContainer = _styledComponents2.default.div(_templateObject);