'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = renderRect;

var _setAttributes = require('../utils/setAttributes');

var _setAttributes2 = _interopRequireDefault(_setAttributes);

var _normalizeColor = require('../utils/normalizeColor');

var _normalizeColor2 = _interopRequireDefault(_normalizeColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create SVGRectElements from an annotation definition.
 * This is used for anntations of type `area` and `highlight`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement|SVGRectElement} A group of all rects to be rendered
 */
function renderRect(a) {
  if (a.type === 'highlight') {
    var _ret = function () {
      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      (0, _setAttributes2.default)(group, {
        fill: (0, _normalizeColor2.default)(a.color || '#ff0'),
        fillOpacity: 0.2
      });

      a.rectangles.forEach(function (r) {
        group.appendChild(createRect(r));
      });

      return {
        v: group
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    var rect = createRect(a);
    (0, _setAttributes2.default)(rect, {
      stroke: (0, _normalizeColor2.default)(a.color || '#f00'),
      fill: 'none',
      strokeWidth: a.strokeWidth
    });

    return rect;
  }
}

function createRect(r) {
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  (0, _setAttributes2.default)(rect, {
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height
  });

  return rect;
}