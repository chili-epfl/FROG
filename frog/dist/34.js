(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ "../ac/ac-display-social/src/ActivityRunner.js":
/*!*****************************************************!*\
  !*** ../ac/ac-display-social/src/ActivityRunner.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"../node_modules/lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n\n // the actual component that the student sees\n\nvar ActivityRunner = function ActivityRunner(props) {\n  var activityData = props.activityData,\n      groupingValue = props.groupingValue,\n      name = props.userInfo.name,\n      dataFn = props.dataFn,\n      data = props.data;\n  var configData = activityData.config;\n\n  if (!data.includes(name)) {\n    dataFn.listAppend(name);\n  }\n\n  var others = Object(lodash__WEBPACK_IMPORTED_MODULE_1__[\"uniq\"])(data).filter(function (x) {\n    return x !== name;\n  });\n  var hasOthers = others.length > 0;\n  return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\", null, configData.title && react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h1\", null, configData.title), react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h2\", null, configData.displayName && \"Hi, \".concat(name, \". \"), \" You are\", ' ', !hasOthers && 'alone ', \"in group \", groupingValue, \".\"), configData.displayGroup && hasOthers && react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h3\", null, 'The other group members are: ' + Object(lodash__WEBPACK_IMPORTED_MODULE_1__[\"uniq\"])(data).filter(function (x) {\n    return x !== name;\n  }).sort().join(', ')));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActivityRunner);\n\n//# sourceURL=webpack:///../ac/ac-display-social/src/ActivityRunner.js?");

/***/ })

}]);