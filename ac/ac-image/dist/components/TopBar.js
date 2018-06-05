"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-flow: row wrap;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  justify-content: center;\n  align-items: center;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents.default.div(_templateObject());

var Body = _styledComponents.default.div(_templateObject2());

var TopBar = function TopBar(_ref) {
  var categories = _ref.categories,
      category = _ref.category,
      canVote = _ref.canVote,
      setCategory = _ref.setCategory,
      setZoom = _ref.setZoom,
      hideCategory = _ref.hideCategory,
      guidelines = _ref.guidelines;
  return _react.default.createElement(Main, null, _react.default.createElement("p", {
    style: {
      fontSize: '22px'
    }
  }, guidelines), _react.default.createElement(Body, {
    className: "bootstrap"
  }, !hideCategory && Object.keys(categories).length > 2 && _react.default.createElement("div", null, category !== 'categories' && _react.default.createElement("button", {
    className: "btn btn-secondary",
    onClick: function onClick() {
      return setCategory('categories');
    },
    style: {
      margin: '5px'
    }
  }, _react.default.createElement("span", {
    className: "glyphicon glyphicon-arrow-left"
  }), ' '), _react.default.createElement("span", {
    style: {
      margin: '5px',
      fontSize: 'large'
    }
  }, "Library :"), _react.default.createElement(_reactBootstrap.DropdownButton, {
    title: category,
    id: "dropdown-basic-0"
  }, categories.filter(function (x) {
    return x !== category;
  }).map(function (y) {
    return _react.default.createElement(_reactBootstrap.MenuItem, {
      key: y,
      eventKey: "toto",
      onClick: function onClick() {
        setZoom(false);
        setCategory(y);
      }
    }, y);
  }))), category !== 'categories' && canVote && _react.default.createElement("i", {
    style: {
      marginLeft: '20px'
    }
  }, "Hold shift while clicking to select a picture :")));
};

TopBar.displayName = 'TopBar';
var _default = TopBar;
exports.default = _default;