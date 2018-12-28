(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ "../ac/ac-display-social/src/ActivityRunner.js":
/*!*****************************************************!*\
  !*** ../ac/ac-display-social/src/ActivityRunner.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar React = _interopRequireWildcard(__webpack_require__(/*! react */ \"../node_modules/react/index.js\"));\n\nvar _lodash = __webpack_require__(/*! lodash */ \"../node_modules/lodash/lodash.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\n// the actual component that the student sees\nvar ActivityRunner = function ActivityRunner(props) {\n  var activityData = props.activityData,\n      groupingValue = props.groupingValue,\n      name = props.userInfo.name,\n      dataFn = props.dataFn,\n      data = props.data;\n  var configData = activityData.config;\n\n  if (!data.includes(name)) {\n    dataFn.listAppend(name);\n  }\n\n  var others = (0, _lodash.uniq)(data).filter(function (x) {\n    return x !== name;\n  });\n  var hasOthers = others.length > 0;\n  return React.createElement(\"div\", null, configData.title && React.createElement(\"h1\", null, configData.title), React.createElement(\"h2\", null, configData.displayName && \"Hi, \".concat(name, \". \"), \" You are\", ' ', !hasOthers && 'alone ', \"in group \", groupingValue, \".\"), configData.displayGroup && hasOthers && React.createElement(\"h3\", null, 'The other group members are: ' + (0, _lodash.uniq)(data).filter(function (x) {\n    return x !== name;\n  }).sort().join(', ')));\n};\n\nvar _default = ActivityRunner;\nexports.default = _default;\n\n//# sourceURL=webpack:///../ac/ac-display-social/src/ActivityRunner.js?");

/***/ })

}]);