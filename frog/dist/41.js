(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[41],{

/***/ "../ac/ac-text/src/ActivityRunner.js":
/*!*******************************************!*\
  !*** ../ac/ac-text/src/ActivityRunner.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = exports.ActivityRunner = void 0;\n\nvar React = _interopRequireWildcard(__webpack_require__(/*! react */ \"../node_modules/react/index.js\"));\n\nvar _frogUtils = __webpack_require__(/*! frog-utils */ \"../frog-utils/src/index.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData;\n  return React.createElement(\"div\", null, React.createElement(\"h1\", null, activityData.config ? activityData.config.title : ''), React.createElement(\"span\", {\n    style: {\n      fontSize: '20px'\n    }\n  }, activityData.config ? React.createElement(_frogUtils.HTML, {\n    html: activityData.config.text\n  }) : ''));\n};\n\nexports.ActivityRunner = ActivityRunner;\nvar _default = ActivityRunner;\nexports.default = _default;\n\n//# sourceURL=webpack:///../ac/ac-text/src/ActivityRunner.js?");

/***/ })

}]);