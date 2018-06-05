"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _mousetrap = _interopRequireDefault(require("mousetrap"));

var _ThumbList = _interopRequireDefault(require("./components/ThumbList"));

var _TopBar = _interopRequireDefault(require("./components/TopBar"));

var _UploadBar = _interopRequireDefault(require("./components/UploadBar"));

var _ZoomView = _interopRequireDefault(require("./components/ZoomView"));

var _WebcamInterface = _interopRequireDefault(require("./components/WebcamInterface"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: column;\n  align-items: center;\n  overflow: hidden;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents.default.div(_templateObject());

var ActivityRunner =
/*#__PURE__*/
function (_Component) {
  function ActivityRunner(props) {
    var _this;

    _classCallCheck(this, ActivityRunner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ActivityRunner).call(this, props));

    _mousetrap.default.bind('esc', function () {
      return _this.setState({
        zoomOn: false
      });
    });

    var data = props.data,
        activityData = props.activityData;
    _this.categories = Object.keys(data).reduce(function (acc, key) {
      return _objectSpread({}, acc, {
        all: _toConsumableArray(acc.all || []).concat([data[key]])
      }, data[key].categories && data[key].categories.reduce(function (_acc, cat) {
        return _objectSpread({}, _acc, _defineProperty({}, cat, _toConsumableArray(acc[cat] || []).concat([data[key]])));
      }, {}));
    }, {});
    var startingCategory = Object.keys(_this.categories).length > 1 && !activityData.config.hideCategory ? 'categories' : 'all';
    _this.state = {
      zoomOn: false,
      index: 0,
      category: startingCategory,
      webcamOn: false
    };
    return _this;
  }

  _createClass(ActivityRunner, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _mousetrap.default.unbind('esc');
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          activityData = _this$props.activityData,
          data = _this$props.data,
          dataFn = _this$props.dataFn,
          userInfo = _this$props.userInfo,
          logger = _this$props.logger,
          stream = _this$props.stream;
      var minVoteT = activityData.config.minVote || 1;
      var images = Object.keys(data).filter(function (key) {
        return data[key] !== undefined && data[key].url !== undefined && (_this2.state.category === 'all' || data[key].categories !== undefined && data[key].categories.includes(_this2.state.category));
      }).map(function (key) {
        return _objectSpread({}, data[key], {
          key: key
        });
      });

      var vote = function vote(key, userId) {
        logger({
          type: 'vote',
          itemId: key
        });
        var prev = data[key].votes ? data[key].votes[userId] : false;
        dataFn.objInsert(!prev, [key, 'votes', userId]);
        stream(!prev, [key, 'votes', userId]);
      };

      var setCategory = function setCategory(c) {
        return _this2.setState({
          category: c
        });
      };

      var setZoom = function setZoom(z) {
        return _this2.setState({
          zoomOn: z
        });
      };

      var setIndex = function setIndex(i) {
        return _this2.setState({
          index: i
        });
      };

      var setWebcam = function setWebcam(w) {
        return _this2.setState({
          webcamOn: w
        });
      };

      var showCategories = this.state.category === 'categories' && !activityData.config.hideCategory;
      return _react.default.createElement(Main, null, _react.default.createElement(_TopBar.default, _extends({
        categories: _toConsumableArray(Object.keys(this.categories)).concat(['categories']),
        category: this.state.category,
        canVote: activityData.config.canVote,
        hideCategory: activityData.config.hideCategory,
        guidelines: activityData.config.guidelines
      }, {
        setCategory: setCategory,
        setZoom: setZoom
      })), images.length === 0 && this.state.category !== 'categories' ? _react.default.createElement("h1", null, activityData.config.acceptAnyFiles ? 'No file' : 'No image') : _react.default.createElement(_ThumbList.default, _extends({
        images: images,
        categories: this.categories,
        minVoteT: minVoteT,
        vote: vote,
        userInfo: userInfo,
        setCategory: setCategory,
        setZoom: setZoom,
        setIndex: setIndex,
        logger: logger,
        showCategories: showCategories
      }, {
        canVote: activityData.config.canVote
      })), this.state.category !== 'categories' && this.state.zoomOn && _react.default.createElement(_ZoomView.default, _extends({
        index: this.state.index,
        commentBox: activityData.config.canComment,
        commentGuidelines: activityData.config.commentGuidelines,
        close: function close() {
          return setZoom(false);
        }
      }, {
        images: images,
        setIndex: setIndex,
        dataFn: dataFn,
        logger: logger
      })), activityData.config.canUpload && _react.default.createElement(_UploadBar.default, _objectSpread({}, this.props, {
        setWebcam: setWebcam
      })), this.state.webcamOn && _react.default.createElement(_WebcamInterface.default, _objectSpread({}, this.props, {
        setWebcam: setWebcam
      })));
    }
  }]);

  _inherits(ActivityRunner, _Component);

  return ActivityRunner;
}(_react.Component);

ActivityRunner.displayName = 'ActivityRunner';

var _default = function _default(props) {
  return _react.default.createElement(ActivityRunner, props);
};

exports.default = _default;