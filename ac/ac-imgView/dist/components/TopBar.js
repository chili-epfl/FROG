'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n  position: absolute;\n  height: 45px;\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: center;\n  align-items: center;\n'], ['\n  position: absolute;\n  height: 45px;\n  display: flex;\n  flex-flow: row wrap;\n  justify-content: center;\n  align-items: center;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents2.default.div(_templateObject);

var TopBar = function TopBar(_ref) {
  var categories = _ref.categories,
      category = _ref.category,
      canVote = _ref.canVote,
      setCategory = _ref.setCategory,
      setZoom = _ref.setZoom;
  return _react2.default.createElement(
    Main,
    null,
    Object.keys(categories).length > 2 && _react2.default.createElement(
      'div',
      null,
      category !== 'categories' && _react2.default.createElement(
        'button',
        {
          className: 'btn btn-secondary',
          onClick: function onClick() {
            return setCategory('categories');
          },
          style: { margin: '5px' }
        },
        _react2.default.createElement('span', { className: 'glyphicon glyphicon-arrow-left' }),
        ' '
      ),
      _react2.default.createElement(
        'span',
        { style: { margin: '5px', fontSize: 'large' } },
        'Library :'
      ),
      _react2.default.createElement(
        _reactBootstrap.DropdownButton,
        { title: category, id: 'dropdown-basic-0' },
        categories.filter(function (x) {
          return x !== category;
        }).map(function (y) {
          return _react2.default.createElement(
            _reactBootstrap.MenuItem,
            {
              key: y,
              eventKey: 'toto',
              onClick: function onClick() {
                setZoom(false);
                setCategory(y);
              }
            },
            y
          );
        })
      )
    ),
    category !== 'categories' && canVote && _react2.default.createElement(
      'i',
      { style: { marginLeft: '20px' } },
      'Hold shift while clicking to select a picture :'
    )
  );
};

TopBar.displayName = 'TopBar';
exports.default = TopBar;