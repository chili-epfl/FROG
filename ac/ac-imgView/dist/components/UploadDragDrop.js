'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: relative;\n  top: 55%;\n  margin: 0 auto;\n  transform: translateY(-50%);\n'], ['\n  position: relative;\n  top: 55%;\n  margin: 0 auto;\n  transform: translateY(-50%);\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var UploadDragDrop = function UploadDragDrop(_ref) {
  var data = _ref.data,
      dataFn = _ref.dataFn,
      uploadFn = _ref.uploadFn,
      logger = _ref.logger;

  var onDrop = function onDrop(f) {
    uploadFn(f, function (url) {
      logger('upload');
      // setTimeout, otherwise HTTP request sends back code 503
      setTimeout(function () {
        return dataFn.objInsert({ url: url, votes: {} }, Object.keys(data).length);
      }, 500);
    });
  };

  return _react2.default.createElement(
    'div',
    { style: { width: '50%', display: 'flex', justifyContent: 'center' } },
    _react2.default.createElement(
      _reactDropzone2.default,
      {
        onDropAccepted: onDrop,
        accept: 'image/jpeg, image/png',
        style: {
          width: '50%',
          border: '2px dashed rgb(102, 102, 102)',
          borderRadius: '5px',
          padding: '10px',
          minWidth: 'fit-content'
        }
      },
      _react2.default.createElement(
        TextStyled,
        null,
        'Drop files here / Click to upload'
      )
    )
  );
};

var TextStyled = _styledComponents2.default.h3(_templateObject);

UploadDragDrop.displayName = 'UploadDragDrop';
exports.default = UploadDragDrop;