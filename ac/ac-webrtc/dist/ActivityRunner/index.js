"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

require("webrtc-adapter");

var _lodash = require("lodash");

var _iceServers = require("../utils/iceServers");

var _codec = require("../utils/codec");

var _Header = _interopRequireDefault(require("./Header"));

var _VideoLayout = _interopRequireDefault(require("./VideoLayout"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var ActivityRunner =
/*#__PURE__*/
function (_Component) {
  _inherits(ActivityRunner, _Component);

  function ActivityRunner(props) {
    var _this;

    _classCallCheck(this, ActivityRunner);

    _this = _possibleConstructorReturn(this, (ActivityRunner.__proto__ || Object.getPrototypeOf(ActivityRunner)).call(this, props));
    Object.defineProperty(_assertThisInitialized(_this), "findConnectionByRemoteUser", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(userInfo) {
        return _this.connections.find(function (conn) {
          return (0, _lodash.isEqual)(conn.remoteUser, userInfo);
        });
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "startConnection", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(remoteUser) {
        var remoteConn = _this.findConnectionByRemoteUser(remoteUser);

        if (_this.state.mode !== 'notReady') {
          if (!remoteConn) {
            return _this.createPeerConnection(remoteUser);
          } else if (remoteConn.signalingState === 'have-local-offer' || 'stable') {
            if (remoteUser.id > _this.props.userInfo.id) {
              _this.handleRemoteHangUp(remoteConn);

              return _this.createPeerConnection(remoteUser);
            }
          }
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "createPeerConnection", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(remoteUser) {
        try {
          var conn = new RTCPeerConnection(_iceServers.ICEConfig);
          conn.onicecandidate = _this.handleIceCandidate;
          conn.onaddstream = _this.handleRemoteStreamAdded;
          conn.oniceconnectionstatechange = _this.handleIceChange;

          if (_this.state.mode === 'readyToCall' || _this.state.mode === 'calling') {
            conn.addStream(_this.state.local.stream);
          }

          conn.remoteUser = remoteUser;

          _this.connections.push(conn);

          return conn;
        } catch (e) {
          console.warn("/Users/mujki/FROG-chili/ac/ac-webrtc/src/ActivityRunner/index.js(58:6)", 'Cannot create RTCPeerConnection object.');
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "handleIceCandidate", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        if (event.candidate) {
          var message = {
            type: 'candidate',
            data: {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate,
              toUser: event.target.remoteUser,
              fromUser: _this.props.userInfo
            }
          };

          _this.props.dataFn.listAppend(message);
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "handleRemoteStreamAdded", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        var index = _this.connections.findIndex(function (x) {
          return x.remoteUser === event.currentTarget.remoteUser;
        });

        var remotes = [];

        switch (_this.state.mode) {
          case 'readyToCall':
            _this.addRemoteStream(remotes, index, event.stream);

            break;

          case 'calling':
            remotes = _this.state.remote;

            if ((0, _lodash.isUndefined)(remotes[index])) {
              _this.addRemoteStream(remotes, index, event.stream);
            }

            break;

          default:
            break;
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "addRemoteStream", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(remotes, index, stream) {
        remotes[index] = {
          stream: stream,
          src: window.URL.createObjectURL(stream),
          remoteUser: _this.connections[index].remoteUser
        };

        _this.setState({
          mode: 'calling',
          remote: remotes
        });
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "handleIceChange", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(event) {
        if (event.target.iceConnectionState === 'failed' || event.target.iceConnectionState === 'disconnected' || event.target.iceConnectionState === 'closed') {
          _this.handleRemoteHangUp(event.target);
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "startOffer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(connection) {
        connection.createOffer(_this.props.activityData.config.sdpConstraints).then(function (offer) {
          _this.setLocalInfoAndSendOffer(offer, connection);
        });
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "setLocalInfoAndSendOffer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(offer, connection) {
        offer.sdp = (0, _codec.preferOpus)(offer.sdp);
        connection.setLocalDescription(offer);
        var message = {
          type: 'offer',
          data: {
            message: offer,
            toUser: connection.remoteUser,
            fromUser: _this.props.userInfo
          }
        };

        _this.props.dataFn.listAppend(message);
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "startAnswer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(connection) {
        connection.createAnswer().then(function (answer) {
          _this.setLocalInfoAndSendAnswer(answer, connection);
        });
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "setLocalInfoAndSendAnswer", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(answer, connection) {
        answer.sdp = (0, _codec.preferOpus)(answer.sdp);
        connection.setLocalDescription(answer);
        var message = {
          type: 'answer',
          data: {
            message: answer,
            toUser: connection.remoteUser,
            fromUser: _this.props.userInfo
          }
        };

        _this.props.dataFn.listAppend(message);
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "handleRemoteHangUp", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(remoteConnection) {
        if (!(0, _lodash.isUndefined)(remoteConnection) && _this.state.mode === 'calling') {
          var newRemotes;

          if (remoteConnection.getRemoteStreams() !== null && _this.state.mode === 'calling') {
            newRemotes = _this.state.remote.filter(function (_ref) {
              var stream = _ref.stream;

              if (stream === remoteConnection.getRemoteStreams()[0]) {
                stream.getTracks().forEach(function (track) {
                  return track.stop();
                });
                return false;
              } else {
                return true;
              }
            });
          }

          remoteConnection.close();
          _this.connections = (0, _lodash.without)(_this.connections, remoteConnection);

          _this.setState({
            mode: 'calling',
            remote: newRemotes
          });
        }
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "gotStream", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value(stream) {
        _this.setState({
          mode: 'readyToCall',
          local: {
            user: _this.props.userInfo.name,
            src: window.URL.createObjectURL(stream),
            stream: stream
          }
        }, _this.call);
      }
    });
    Object.defineProperty(_assertThisInitialized(_this), "call", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function value() {
        var message = {
          type: 'join',
          data: {
            room: _this.props.groupingValue || 'room',
            fromUser: _this.props.userInfo
          }
        };

        _this.props.dataFn.listAppend(message);
      }
    });
    _this.connections = [];
    _this.state = {
      mode: 'notReady',
      local: {},
      remote: []
    };
    return _this;
  }

  _createClass(ActivityRunner, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      navigator.mediaDevices.getUserMedia(this.props.activityData.config.sdpConstraints).then(this.gotStream).catch(function (e) {
        console.warn("/Users/mujki/FROG-chili/ac/ac-webrtc/src/ActivityRunner/index.js(201:8)", 'Not able to get camera: ', "e", e);
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if ((this.state.mode === 'calling' || this.state.mode === 'readyToCall') && !(0, _lodash.isUndefined)(this.state.local.stream)) {
        this.state.local.stream.getTracks().forEach(function (track) {
          return track.stop();
        });
      }

      if (this.state.mode === 'calling') {
        if (this.state.remote.length > 0) {
          this.state.remote.forEach(function (_ref2) {
            var stream = _ref2.stream;
            stream.getTracks().forEach(function (track) {
              return track.stop();
            });
          });
        }

        if (this.connections.length > 0) {
          this.connections.forEach(function (connection) {
            connection.close();
          });
        }

        this.connections = [];
        this.setState({
          mode: 'hangUp'
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if ((0, _lodash.difference)(nextProps.data, this.props.data).length > 0) {
        var newMess = (0, _lodash.last)(nextProps.data);

        if (!(0, _lodash.isEqual)(newMess.data.fromUser, this.props.userInfo)) {
          if (newMess.type === 'join' && this.state.mode !== 'notReady') {
            var connection = this.startConnection(newMess.data.fromUser);

            if (connection) {
              this.startOffer(connection);
            }
          } else if ((0, _lodash.isEqual)(newMess.data.toUser, this.props.userInfo)) {
            switch (newMess.type) {
              case 'offer':
                {
                  var connectionOffer = this.startConnection(newMess.data.fromUser);

                  if (connectionOffer) {
                    connectionOffer.setRemoteDescription(new RTCSessionDescription(newMess.data.message));
                    this.startAnswer(connectionOffer);
                  }

                  break;
                }

              case 'answer':
                {
                  var cbru = this.findConnectionByRemoteUser(newMess.data.fromUser);

                  if (cbru) {
                    cbru.setRemoteDescription(new RTCSessionDescription(newMess.data.message));
                  }

                  break;
                }

              case 'candidate':
                {
                  var candidate = new RTCIceCandidate({
                    sdpMLineIndex: newMess.data.label,
                    candidate: newMess.data.candidate
                  });

                  var _cbru = this.findConnectionByRemoteUser(newMess.data.fromUser);

                  if (_cbru) {
                    _cbru.addIceCandidate(candidate);
                  }

                  break;
                }

              default:
                {
                  break;
                }
            }
          }
        }

        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var local = this.state.mode === 'readyTocall' || this.state.mode === 'calling' ? this.state.local : {};
      var remote = this.state.mode === 'calling' ? this.state.remote : [];
      return _react.default.createElement("div", {
        id: "webrtc"
      }, _react.default.createElement(_Header.default, this.props), _react.default.createElement(_VideoLayout.default, {
        local: local,
        remote: remote
      }));
    }
  }]);

  return ActivityRunner;
}(_react.Component);

ActivityRunner.displayName = 'ActivityRunner';

var _default = function _default(props) {
  return _react.default.createElement(ActivityRunner, props);
};

exports.default = _default;