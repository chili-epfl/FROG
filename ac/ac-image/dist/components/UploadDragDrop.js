"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDropzone = _interopRequireDefault(require("react-dropzone"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  top: 55%;\n  margin: 0 auto;\n  transform: translateY(-50%);\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var UploadDragDrop = function UploadDragDrop(_ref) {
  var dataFn = _ref.dataFn,
      stream = _ref.stream,
      uploadFn = _ref.uploadFn,
      logger = _ref.logger,
      activityData = _ref.activityData;

  var onDrop = function onDrop(f) {
    f.forEach(function (imageFile) {
      return (0, _utils.default)(imageFile, logger, dataFn, stream, uploadFn, 'dragdrop-upload');
    });
  };

  return _react.default.createElement("div", {
    style: {
      width: '50%',
      display: 'flex',
      justifyContent: 'center'
    }
  }, _react.default.createElement(_reactDropzone.default, {
    onDropAccepted: onDrop,
    accept: activityData.config.acceptAnyFiles ? undefined : 'image/jpeg, image/png',
    style: {
      width: '50%',
      border: '2px dashed rgb(102, 102, 102)',
      borderRadius: '5px',
      padding: '10px',
      minWidth: 'fit-content'
    }
  }, _react.default.createElement(TextStyled, null, "Drop files here / Click to upload")));
};

var TextStyled = _styledComponents.default.h3(_templateObject());

UploadDragDrop.displayName = 'UploadDragDrop';
var _default = UploadDragDrop;
exports.default = _default;