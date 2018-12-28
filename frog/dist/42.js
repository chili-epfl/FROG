(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "../ac/ac-textarea/src/ActivityRunner.js":
/*!***********************************************!*\
  !*** ../ac/ac-textarea/src/ActivityRunner.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar React = _interopRequireWildcard(__webpack_require__(/*! react */ \"../node_modules/react/index.js\"));\n\nvar _frogUtils = __webpack_require__(/*! frog-utils */ \"../frog-utils/src/index.js\");\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\n// the actual component that the student sees\nvar ActivityRunner = function ActivityRunner(_ref) {\n  var activityData = _ref.activityData,\n      dataFn = _ref.dataFn;\n  var conf = activityData.config;\n  var header = conf && [conf.title && React.createElement(\"h1\", {\n    key: \"title\"\n  }, conf.title), conf.guidelines && React.createElement(\"p\", {\n    key: \"guidelines\",\n    style: {\n      fontSize: '20px'\n    }\n  }, conf.guidelines), React.createElement(\"ul\", {\n    key: \"prompt\",\n    style: {\n      fontSize: '20px'\n    }\n  }, conf.prompt && conf.prompt.split('\\n').map(function (x) {\n    return React.createElement(\"li\", {\n      key: x\n    }, x);\n  }))];\n  return React.createElement(\"div\", {\n    style: {\n      height: '95%'\n    }\n  }, header, React.createElement(_frogUtils.ReactiveText, {\n    type: \"textarea\",\n    path: \"text\",\n    dataFn: dataFn,\n    key: \"textarea\",\n    placeholder: conf && conf.placeholder,\n    style: {\n      width: '100%',\n      height: '100%',\n      fontSize: '20px'\n    }\n  }));\n};\n\nvar _default = ActivityRunner;\nexports.default = _default;\n\n//# sourceURL=webpack:///../ac/ac-textarea/src/ActivityRunner.js?");

/***/ })

}]);