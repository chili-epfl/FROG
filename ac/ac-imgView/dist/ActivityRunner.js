'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: column;\n  align-items: center;\n  overflow: hidden;\n'], ['\n  display: flex;\n  width: 100%;\n  height: 100%;\n  flex-direction: column;\n  align-items: center;\n  overflow: hidden;\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _ThumbList = require('./components/ThumbList');

var _ThumbList2 = _interopRequireDefault(_ThumbList);

var _TopBar = require('./components/TopBar');

var _TopBar2 = _interopRequireDefault(_TopBar);

var _UploadBar = require('./components/UploadBar');

var _UploadBar2 = _interopRequireDefault(_UploadBar);

var _ZoomView = require('./components/ZoomView');

var _ZoomView2 = _interopRequireDefault(_ZoomView);

var _WebcamInterface = require('./components/WebcamInterface');

var _WebcamInterface2 = _interopRequireDefault(_WebcamInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Main = _styledComponents2.default.div(_templateObject);

var ActivityRunner = function (_Component) {
  _inherits(ActivityRunner, _Component);

  function ActivityRunner(props) {
    _classCallCheck(this, ActivityRunner);

    var _this = _possibleConstructorReturn(this, (ActivityRunner.__proto__ || Object.getPrototypeOf(ActivityRunner)).call(this, props));

    _mousetrap2.default.bind('esc', function () {
      return _this.setState({ zoomOn: false });
    });

    var data = props.data;

    _this.categories = Object.keys(data).reduce(function (acc, key) {
      return _extends({}, acc, {
        all: [].concat(_toConsumableArray(acc.all || []), [data[key].url])
      }, data[key].categories && data[key].categories.reduce(function (_acc, cat) {
        return _extends({}, _acc, _defineProperty({}, cat, [].concat(_toConsumableArray(acc[cat] || []), [data[key].url])));
      }, {}));
    }, {});

    var startingCategory = Object.keys(_this.categories).length > 1 ? 'categories' : 'all';

    _this.state = {
      zoomOn: false,
      index: 0,
      category: startingCategory,
      webcamOn: false
    };
    return _this;
  }

  _createClass(ActivityRunner, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _mousetrap2.default.unbind('esc');
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          activityData = _props.activityData,
          data = _props.data,
          dataFn = _props.dataFn,
          userInfo = _props.userInfo,
          logger = _props.logger;


      var minVoteT = activityData.config.minVote || 1;

      var images = Object.keys(data).filter(function (key) {
        return data[key] !== undefined && data[key].url !== undefined && (_this2.state.category === 'all' || data[key].categories !== undefined && data[key].categories.includes(_this2.state.category));
      }).map(function (key) {
        return _extends({}, data[key], { key: key });
      });

      var vote = function vote(key, userId) {
        logger('vote');
        var prev = data[key].votes ? data[key].votes[userId] : false;
        dataFn.objInsert(!prev, [key, 'votes', userId]);
      };

      var setCategory = function setCategory(c) {
        return _this2.setState({ category: c });
      };
      var setZoom = function setZoom(z) {
        return _this2.setState({ zoomOn: z });
      };
      var setIndex = function setIndex(i) {
        return _this2.setState({ index: i });
      };
      var setWebcam = function setWebcam(w) {
        return _this2.setState({ webcamOn: w });
      };

      return _react2.default.createElement(
        Main,
        null,
        _react2.default.createElement(_TopBar2.default, _extends({
          categories: [].concat(_toConsumableArray(Object.keys(this.categories)), ['categories']),
          category: this.state.category,
          canVote: activityData.config.canVote
        }, { setCategory: setCategory, setZoom: setZoom })),
        _react2.default.createElement(_ThumbList2.default, _extends({
          images: images,
          categories: this.categories,
          minVoteT: minVoteT,
          vote: vote,
          userInfo: userInfo,
          setCategory: setCategory,
          setZoom: setZoom,
          setIndex: setIndex
        }, {
          canVote: activityData.config.canVote,
          showingCategories: this.state.category === 'categories'
        })),
        this.state.category !== 'categories' && this.state.zoomOn && _react2.default.createElement(_ZoomView2.default, _extends({
          index: this.state.index
        }, { close: function close() {
            return setZoom(false);
          }, images: images, setIndex: setIndex })),
        activityData.config.canUpload && _react2.default.createElement(_UploadBar2.default, _extends({}, this.props, { setWebcam: setWebcam })),
        this.state.webcamOn && _react2.default.createElement(_WebcamInterface2.default, _extends({}, this.props, { setWebcam: setWebcam }))
      );
    }
  }]);

  return ActivityRunner;
}(_react.Component);

ActivityRunner.displayName = 'ActivityRunner';

exports.default = function (props) {
  return _react2.default.createElement(ActivityRunner, props);
};