'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.setText = setText;
exports.enableText = enableText;
exports.disableText = disableText;

var _PDFJSAnnotate = require('../PDFJSAnnotate');

var _PDFJSAnnotate2 = _interopRequireDefault(_PDFJSAnnotate);

var _appendChild = require('../render/appendChild');

var _appendChild2 = _interopRequireDefault(_appendChild);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _enabled = false;
var input = void 0;
var _textSize = void 0;
var _textColor = void 0;

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {
  if (input || !(0, _utils.findSVGAtPoint)(e.clientX, e.clientY)) {
    return;
  }

  input = document.createElement('input');
  input.setAttribute('id', 'pdf-annotate-text-input');
  input.setAttribute('placeholder', 'Enter text');
  input.style.border = '3px solid ' + _utils.BORDER_COLOR;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = e.clientY + 'px';
  input.style.left = e.clientX + 'px';
  input.style.fontSize = _textSize + 'px';
  input.style.color = _textColor;

  input.addEventListener('blur', handleInputBlur);
  input.addEventListener('keyup', handleInputKeyup);

  document.body.appendChild(input);
  input.focus();
}

/**
 * Handle input.blur event
 */
function handleInputBlur() {
  saveText();
}

/**
 * Handle input.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleInputKeyup(e) {
  if (e.keyCode === 27) {
    closeInput();
  } else if (e.keyCode === 13) {
    saveText();
  }
}

/**
 * Save a text annotation from input
 */
function saveText() {
  if (input.value.trim().length > 0) {
    var _ret = function () {
      var clientX = parseInt(input.style.left, 10);
      var clientY = parseInt(input.style.top, 10);
      var svg = (0, _utils.findSVGAtPoint)(clientX, clientY);
      if (!svg) {
        return {
          v: void 0
        };
      }

      var _getMetadata = (0, _utils.getMetadata)(svg);

      var documentId = _getMetadata.documentId;
      var pageNumber = _getMetadata.pageNumber;

      var rect = svg.getBoundingClientRect();
      var annotation = Object.assign({
        type: 'textbox',
        size: _textSize,
        color: _textColor,
        content: input.value.trim()
      }, (0, _utils.scaleDown)(svg, {
        x: clientX - rect.left,
        y: clientY - rect.top,
        width: input.offsetWidth,
        height: input.offsetHeight
      }));

      _PDFJSAnnotate2.default.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation).then(function (annotation) {
        (0, _appendChild2.default)(svg, annotation);
      });
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  closeInput();
}

/**
 * Close the input
 */
function closeInput() {
  if (input) {
    input.removeEventListener('blur', handleInputBlur);
    input.removeEventListener('keyup', handleInputKeyup);
    document.body.removeChild(input);
    input = null;
  }
}

/**
 * Set the text attributes
 *
 * @param {Number} textSize The size of the text
 * @param {String} textColor The color of the text
 */
function setText() {
  var textSize = arguments.length <= 0 || arguments[0] === undefined ? 12 : arguments[0];
  var textColor = arguments.length <= 1 || arguments[1] === undefined ? '000000' : arguments[1];

  _textSize = parseInt(textSize, 10);
  _textColor = textColor;
}

/**
 * Enable text behavior
 */
function enableText() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  document.addEventListener('mouseup', handleDocumentMouseup);
}

/**
 * Disable text behavior
 */
function disableText() {
  if (!_enabled) {
    return;
  }

  _enabled = false;
  document.removeEventListener('mouseup', handleDocumentMouseup);
}