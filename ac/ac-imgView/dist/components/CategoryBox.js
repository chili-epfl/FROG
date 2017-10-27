'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: relative;\n  border: solid 2px #a0a0a0;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n  justify-content: center;\n'], ['\n  position: relative;\n  border: solid 2px #a0a0a0;\n  background: none;\n  max-width: 250px;\n  height: 250px;\n  width: 100%;\n  margin: 5px;\n  padding: 0px;\n  flex: 0 1 auto;\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n  justify-content: center;\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  position: relative;\n  min-width: 80px;\n  min-height: 80px;\n  margin: 5px;\n  flex: 1 1 auto;\n'], ['\n  position: relative;\n  min-width: 80px;\n  min-height: 80px;\n  margin: 5px;\n  flex: 1 1 auto;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  position: absolute;\n  height: 10%;\n  bottom: 0px;\n'], ['\n  position: absolute;\n  height: 10%;\n  bottom: 0px;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _CenteredImg = require('./CenteredImg');

var _CenteredImg2 = _interopRequireDefault(_CenteredImg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var CategoryContainer = _styledComponents2.default.button(_templateObject);

var ImgContainer = _styledComponents2.default.div(_templateObject2);

var CategoryName = _styledComponents2.default.span(_templateObject3);

var CategoryBox = function CategoryBox(_ref) {
  var images = _ref.images,
      category = _ref.category,
      setCategory = _ref.setCategory;
  return _react2.default.createElement(
    CategoryContainer,
    { onClick: function onClick() {
        return setCategory(category);
      } },
    images.slice(0, 4).map(function (image, i) {
      return _react2.default.createElement(
        ImgContainer,
        { key: image + i.toString() },
        _react2.default.createElement(_CenteredImg2.default, { url: image })
      );
    }),
    _react2.default.createElement(
      CategoryName,
      null,
      category
    )
  );
};

CategoryBox.displayName = 'CategoryBox';
exports.default = CategoryBox;