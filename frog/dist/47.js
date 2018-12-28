(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[47],{

/***/ "./imports/internalActivities/ac-dash/ActivityRunner.js":
/*!**************************************************************!*\
  !*** ./imports/internalActivities/ac-dash/ActivityRunner.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module '/imports/ui/Dashboard'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n\nvar ActivityRunner = function ActivityRunner(props) {\n  var sessionId = props.sessionId,\n      config = props.activityData.config;\n  var activityId = config.component.activity;\n  var names = config.component.dashboards;\n  return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](!(function webpackMissingModule() { var e = new Error(\"Cannot find module '/imports/ui/Dashboard'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {\n    activityId: activityId,\n    sessionId: sessionId,\n    names: names\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActivityRunner);\n\n//# sourceURL=webpack:///./imports/internalActivities/ac-dash/ActivityRunner.js?");

/***/ })

}]);