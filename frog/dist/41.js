(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[41],{

/***/ "../ac/ac-text/src/ActivityRunner.js":
/*!*******************************************!*\
  !*** ../ac/ac-text/src/ActivityRunner.js ***!
  \*******************************************/
/*! exports provided: ActivityRunner, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ActivityRunner\", function() { return ActivityRunner; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var frog_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! frog-utils */ \"../frog-utils/src/index.js\");\n\n\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData;\n  return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\", null, react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h1\", null, activityData.config ? activityData.config.title : ''), react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"span\", {\n    style: {\n      fontSize: '20px'\n    }\n  }, activityData.config ? react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](frog_utils__WEBPACK_IMPORTED_MODULE_1__[\"HTML\"], {\n    html: activityData.config.text\n  }) : ''));\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActivityRunner);\n\n//# sourceURL=webpack:///../ac/ac-text/src/ActivityRunner.js?");

/***/ })

}]);