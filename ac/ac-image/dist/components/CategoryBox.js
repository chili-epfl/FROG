"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _fontAwesomeFiletypes = _interopRequireDefault(require("font-awesome-filetypes"));

var _CenteredImg = _interopRequireDefault(require("./CenteredImg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  height: 10%;\n  bottom: 0px;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  min-width: 80px;\n  min-height: 80px;\n  margin: 5px;\n  flex: 1 1 auto;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  border: solid 2px #a0a0a0;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n  justify-content: center;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CategoryContainer = _styledComponents.default.button(_templateObject());

var ImgContainer = _styledComponents.default.div(_templateObject2());

var CategoryName = _styledComponents.default.span(_templateObject3());

var CategoryBox = function CategoryBox(_ref) {
  var images = _ref.images,
      category = _ref.category,
      setCategory = _ref.setCategory,
      logger = _ref.logger;
  return _react.default.createElement(CategoryContainer, {
    onClick: function onClick() {
      logger({
        type: 'category.enter',
        value: category
      });
      setCategory(category);
    }
  }, images.slice(0, 4).map(function (image, i) {
    return _react.default.createElement(ImgContainer, {
      key: image + i.toString()
    }, image.thumbnail || !image.filename ? _react.default.createElement(_CenteredImg.default, {
      url: image.thumbnail || image.url
    }) : _react.default.createElement("span", null, _react.default.createElement("i", {
      style: {
        fontSize: '70px'
      },
      className: 'fa ' + (0, _fontAwesomeFiletypes.default)(image.ext || ''),
      "aria-hidden": "true"
    })));
  }), _react.default.createElement(CategoryName, null, category));
};

CategoryBox.displayName = 'CategoryBox';
var _default = CategoryBox;
exports.default = _default;