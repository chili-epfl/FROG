(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[36],{

/***/ "../ac/ac-iframe/src/ActivityRunner.js":
/*!*********************************************!*\
  !*** ../ac/ac-iframe/src/ActivityRunner.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData,\n      data = _ref.data;\n  var url = activityData.config.url;\n\n  if (data.uuid) {\n    url = url && url.replace('{}', data.uuid);\n  }\n\n  return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"iframe\", {\n    title: \"IFrame\",\n    src: url,\n    allow: activityData.config.trusted && 'geolocation *; microphone *; camera *; midi *; encrypted-media *;',\n    style: {\n      width: '100%',\n      height: '100%',\n      overflow: 'auto'\n    }\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActivityRunner);\n\n//# sourceURL=webpack:///../ac/ac-iframe/src/ActivityRunner.js?");

/***/ })

}]);