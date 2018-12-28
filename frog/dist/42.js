(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "../ac/ac-textarea/src/ActivityRunner.js":
/*!***********************************************!*\
  !*** ../ac/ac-textarea/src/ActivityRunner.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"../node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var frog_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! frog-utils */ \"../frog-utils/src/index.js\");\n\n // the actual component that the student sees\n\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData,\n      dataFn = _ref.dataFn;\n  var conf = activityData.config;\n  var header = conf && [conf.title && react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"h1\", {\n    key: \"title\"\n  }, conf.title), conf.guidelines && react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"p\", {\n    key: \"guidelines\",\n    style: {\n      fontSize: '20px'\n    }\n  }, conf.guidelines), react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"ul\", {\n    key: \"prompt\",\n    style: {\n      fontSize: '20px'\n    }\n  }, conf.prompt && conf.prompt.split('\\n').map(function (x) {\n    return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"li\", {\n      key: x\n    }, x);\n  }))];\n  return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](\"div\", {\n    style: {\n      height: '95%'\n    }\n  }, header, react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](frog_utils__WEBPACK_IMPORTED_MODULE_1__[\"ReactiveText\"], {\n    type: \"textarea\",\n    path: \"text\",\n    dataFn: dataFn,\n    key: \"textarea\",\n    placeholder: conf && conf.placeholder,\n    style: {\n      width: '100%',\n      height: '100%',\n      fontSize: '20px'\n    }\n  }));\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ActivityRunner);\n\n//# sourceURL=webpack:///../ac/ac-textarea/src/ActivityRunner.js?");

/***/ })

}]);