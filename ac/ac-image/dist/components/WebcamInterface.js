"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _reactWebcam = _interopRequireDefault(require("@houshuang/react-webcam"));

var _mousetrap = _interopRequireDefault(require("mousetrap"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  background: rgba(50, 50, 50, 0.8);\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var takePicture = function takePicture(_ref) {
  var uploadFn = _ref.uploadFn,
      dataFn = _ref.dataFn,
      logger = _ref.logger,
      stream = _ref.stream,
      webcam = _ref.webcam,
      setWebcam = _ref.setWebcam;
  var dataURI = webcam.getScreenshot();

  if (!dataURI) {
    return;
  } // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this


  var byteString = atob(dataURI.split(',')[1]); // separate out the mime component

  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // write the bytes of the string to an ArrayBuffer

  var ab = new ArrayBuffer(byteString.length); // create a view into the buffer

  var ia = new Uint8Array(ab); // set the bytes of the buffer to the correct values

  for (var i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  } // write the ArrayBuffer to a blob, and you're done


  var blob = new Blob([ab], {
    type: mimeString
  });
  (0, _utils.default)(blob, logger, dataFn, stream, uploadFn, 'webcam-upload');
  setWebcam(false);
};

var WebcamCapture = function WebcamCapture(props) {
  var webcam = {
    getScreenshot: function getScreenshot() {
      return null;
    }
  };

  _mousetrap.default.bind('esc', function () {
    return props.setWebcam(false);
  });

  return _react.default.createElement(WebcamContainer, null, _react.default.createElement(_reactWebcam.default, {
    audio: false,
    ref: function ref(node) {
      return webcam = node;
    },
    screenshotFormat: "image/jpeg",
    style: {
      width: '60%',
      height: '90%',
      margin: 'auto'
    }
  }), _react.default.createElement("button", {
    className: "btn btn-primary",
    onClick: function onClick() {
      return takePicture(_objectSpread({}, props, {
        webcam: webcam
      }));
    },
    style: {
      height: '100px',
      marginTop: 'auto',
      marginBottom: 'auto',
      marginRight: 'auto'
    }
  }, "Take a picture"), _react.default.createElement("button", {
    onClick: function onClick() {
      return props.setWebcam(false);
    },
    className: "btn btn-secondary",
    style: {
      position: 'absolute',
      right: '0px'
    }
  }, _react.default.createElement("span", {
    className: "glyphicon glyphicon-remove"
  })));
};

WebcamCapture.displayName = 'WebcamCapture';
var _default = WebcamCapture;
exports.default = _default;

var WebcamContainer = _styledComponents.default.div(_templateObject());