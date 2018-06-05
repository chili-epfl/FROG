"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _downloadjs = _interopRequireDefault(require("downloadjs"));

var _ImageBox = _interopRequireDefault(require("./ImageBox"));

var _CategoryBox = _interopRequireDefault(require("./CategoryBox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-flow: row wrap;\n  width: 100%;\n  top: 60px;\n  bottom: 85px;\n  overflow: auto;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents.default.div(_templateObject());

var ImageList = function ImageList(_ref) {
  var images = _ref.images,
      vote = _ref.vote,
      minVoteT = _ref.minVoteT,
      canVote = _ref.canVote,
      userInfo = _ref.userInfo,
      setZoom = _ref.setZoom,
      setIndex = _ref.setIndex,
      logger = _ref.logger;
  return _react.default.createElement(Main, null, images.map(function (image, i) {
    var onClick = function onClick(e) {
      if (canVote && e.shiftKey) {
        vote(image.key, userInfo.id);
      } else if (image.thumbnail || !image.filename) {
        setIndex(i);
        setZoom(true);
        logger({
          type: 'zoom',
          itemId: image.key
        });
      } else {
        logger({
          type: 'download',
          itemId: image.key,
          value: image.filename
        });
        (0, _downloadjs.default)(image.url, image.filename);
      }
    };

    var voteCount = Object.values(image.votes || {}).reduce(function (n, v) {
      return v ? n + 1 : n;
    }, 0);
    var styleCode = voteCount >= minVoteT ? 'chosen_by_team' : voteCount > 0 ? 'chosen_partially' : 'not_chosen';
    return _react.default.createElement(_ImageBox.default, _extends({
      key: image.key
    }, {
      image: image,
      onClick: onClick,
      styleCode: styleCode
    }));
  }));
};

var CategoryList = function CategoryList(_ref2) {
  var categories = _ref2.categories,
      setCategory = _ref2.setCategory,
      logger = _ref2.logger;
  return _react.default.createElement(Main, null, Object.keys(categories).map(function (category) {
    return _react.default.createElement(_CategoryBox.default, {
      key: JSON.stringify(category),
      images: categories[category],
      category: category,
      setCategory: setCategory,
      logger: logger
    });
  }));
};

var ThumbList = function ThumbList(props) {
  return props.showCategories ? _react.default.createElement(CategoryList, props) : _react.default.createElement(ImageList, props);
};

ThumbList.displayName = 'ThumbList';
var _default = ThumbList;
exports.default = _default;