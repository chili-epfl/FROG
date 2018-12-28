(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[36],{

/***/ "../ac/ac-iframe/src/ActivityRunner.js":
/*!*********************************************!*\
  !*** ../ac/ac-iframe/src/ActivityRunner.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar React = _interopRequireWildcard(__webpack_require__(/*! react */ \"../node_modules/react/index.js\"));\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData,\n      data = _ref.data;\n  var url = activityData.config.url;\n\n  if (data.uuid) {\n    url = url && url.replace('{}', data.uuid);\n  }\n\n  return React.createElement(\"iframe\", {\n    title: \"IFrame\",\n    src: url,\n    allow: activityData.config.trusted && 'geolocation *; microphone *; camera *; midi *; encrypted-media *;',\n    style: {\n      width: '100%',\n      height: '100%',\n      overflow: 'auto'\n    }\n  });\n};\n\nvar _default = ActivityRunner;\nexports.default = _default;\n\n//# sourceURL=webpack:///../ac/ac-iframe/src/ActivityRunner.js?");

/***/ })

}]);