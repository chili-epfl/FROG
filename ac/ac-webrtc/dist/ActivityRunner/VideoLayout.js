"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Video = _interopRequireDefault(require("./Video"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var VideoBoxS = {
  maxWidth: '400px',
  minWidth: '200px',
  flex: '0 1 auto',
  margin: 'auto',
  textAlign: 'center',
  fontSize: '1.20em'
};
var LayoutBoxS = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap'
};

var _default = function _default(_ref) {
  var local = _ref.local,
      remote = _ref.remote;
  var VideoList = remote.length > 0 ? React.createElement(React.Fragment, null, React.createElement("div", {
    style: VideoBoxS,
    key: "local"
  }, React.createElement(_Video.default, {
    src: local.src,
    self: true
  }), local.user && React.createElement("p", null, React.createElement("i", null, "Local: ", local.user))), remote.map(function (connection, index) {
    return React.createElement("div", {
      style: VideoBoxS,
      key: connection.remoteUser.id
    }, React.createElement(_Video.default, {
      index: 'remotevideo' + index,
      src: connection.src,
      name: connection.remoteUser.name
    }), React.createElement("p", null, connection.remoteUser && connection.remoteUser.name));
  })) : React.createElement("h2", null, "Waiting for other users to join");
  return React.createElement("div", {
    style: LayoutBoxS
  }, VideoList);
};

exports.default = _default;