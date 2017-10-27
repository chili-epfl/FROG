'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  flex-flow: row wrap;\n  width: 100%;\n  position: absolute;\n  top: 60px;\n  bottom: 85px;\n  overflow: auto;\n'], ['\n  display: flex;\n  flex-flow: row wrap;\n  width: 100%;\n  position: absolute;\n  top: 60px;\n  bottom: 85px;\n  overflow: auto;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _ImageBox = require('./ImageBox');

var _ImageBox2 = _interopRequireDefault(_ImageBox);

var _CategoryBox = require('./CategoryBox');

var _CategoryBox2 = _interopRequireDefault(_CategoryBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents2.default.div(_templateObject);

var ImageList = function ImageList(_ref) {
  var images = _ref.images,
      vote = _ref.vote,
      minVoteT = _ref.minVoteT,
      canVote = _ref.canVote,
      userInfo = _ref.userInfo,
      setZoom = _ref.setZoom,
      setIndex = _ref.setIndex;
  return _react2.default.createElement(
    Main,
    null,
    images.map(function (image, i) {
      var onClick = function onClick(e) {
        if (canVote && e.shiftKey) {
          vote(image.key, userInfo.id);
        } else {
          setIndex(i);
          setZoom(true);
        }
      };

      var voteCount = Object.values(image.votes).reduce(function (n, v) {
        return v ? n + 1 : n;
      }, 0);

      var styleCode = voteCount >= minVoteT ? 'chosen_by_team' : voteCount > 0 ? 'chosen_partially' : 'not_chosen';

      return _react2.default.createElement(_ImageBox2.default, _extends({
        key: JSON.stringify(image)
      }, { image: image, onClick: onClick, styleCode: styleCode }));
    })
  );
};

var CategoryList = function CategoryList(_ref2) {
  var categories = _ref2.categories,
      setCategory = _ref2.setCategory;
  return _react2.default.createElement(
    Main,
    null,
    Object.keys(categories).map(function (category) {
      return _react2.default.createElement(_CategoryBox2.default, {
        key: JSON.stringify(category),
        images: categories[category],
        category: category,
        setCategory: setCategory
      });
    })
  );
};

var ThumbList = function ThumbList(_ref3) {
  var images = _ref3.images,
      categories = _ref3.categories,
      setCategory = _ref3.setCategory,
      minVoteT = _ref3.minVoteT,
      vote = _ref3.vote,
      canVote = _ref3.canVote,
      userInfo = _ref3.userInfo,
      showingCategories = _ref3.showingCategories,
      setZoom = _ref3.setZoom,
      setIndex = _ref3.setIndex;
  return showingCategories ? _react2.default.createElement(CategoryList, { categories: categories, setCategory: setCategory }) : _react2.default.createElement(ImageList, { images: images, minVoteT: minVoteT, vote: vote, canVote: canVote, userInfo: userInfo, setZoom: setZoom, setIndex: setIndex });
};

ThumbList.displayName = 'ThumbList';
exports.default = ThumbList;