// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';
import { isUndefined, isEqual, without, difference, last } from 'lodash';

import { ICEConfig } from './iceServers';
import { LocalVideo, RemoteVideo } from './Video';
import { preferOpus } from './codec';

type StateT =
  | { mode: 'notReady' }
  | { mode: 'readyToCall', local: Object }
  | { mode: 'calling', local: Object, remote: Array }
  | { mode: 'hangUp' };

class ActivityRunner extends Component {
  state: StateT;

  findConnectionByRemoteUser = userInfo =>
    this.connections.find(conn => isEqual(conn.remoteUser, userInfo));

  startConnection = remoteUser => {
    const remoteConn = this.findConnectionByRemoteUser(remoteUser);

    if (this.state.mode !== 'notReady') {
      if (isUndefined(remoteConn)) {
        return this.createPeerConnection(remoteUser);
      } else if (remoteConn.signalingState === 'have-local-offer' || 'stable') {
        if (remoteUser.id > this.props.userInfo.id) {
          this.handleRemoteHangUp(remoteConn);
          return this.createPeerConnection(remoteUser);
        }
      }
    }
  };

  createPeerConnection = remoteUser => {
    try {
      const conn = new RTCPeerConnection(ICEConfig);
      conn.onicecandidate = this.handleIceCandidate;
      conn.onaddstream = this.handleRemoteStreamAdded;
      conn.oniceconnectionstatechange = this.handleIceChange;
      conn.addStream(this.state.local.stream);
      conn.remoteUser = remoteUser;
      this.connections.push(conn);
      return conn;
    } catch (e) {
      console.warn('Cannot create RTCPeerConnection object.');
    }
  };

  handleIceCandidate = event => {
    if (event.candidate) {
      const message = {
        type: 'candidate',
        data: {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
          toUser: event.target.remoteUser,
          fromUser: this.props.userInfo
        }
      };
      this.props.dataFn.listAppend(message);
    }
  };

  handleRemoteStreamAdded = event => {
    const index = this.connections.findIndex(
      x => x.remoteUser === event.currentTarget.remoteUser
    );
    let remotes = [];
    switch (this.state.mode) {
      case 'readyToCall':
        this.addRemoteStream(remotes, index, event.stream);
        break;
      case 'calling':
        remotes = this.state.remote;
        if (isUndefined(remotes[index])) {
          this.addRemoteStream(remotes, index, event.stream);
        }
        break;
      default:
        break;
    }
  };

  addRemoteStream = (remotes, index, stream) => {
    remotes[index] = {
      stream,
      src: window.URL.createObjectURL(stream),
      remoteUser: this.connections[index].remoteUser
    };
    this.setState({
      mode: 'calling',
      remote: remotes
    });
  };

  handleIceChange = event => {
    if (
      event.target.iceConnectionState === 'failed' ||
      event.target.iceConnectionState === 'disconnected' ||
      event.target.iceConnectionState === 'closed'
    ) {
      this.handleRemoteHangUp(event.target);
    }
  };

  startOffer = connection => {
    connection
      .createOffer(this.props.activityData.config.sdpConstraints)
      .then(offer => {
        this.setLocalInfoAndSendOffer(offer, connection);
      });
  };

  setLocalInfoAndSendOffer = (offer, connection) => {
    offer.sdp = preferOpus(offer.sdp);
    connection.setLocalDescription(offer);
    const message = {
      type: 'offer',
      data: {
        message: offer,
        toUser: connection.remoteUser,
        fromUser: this.props.userInfo
      }
    };
    this.props.dataFn.listAppend(message);
  };

  startAnswer = connection => {
    connection.createAnswer().then(answer => {
      this.setLocalInfoAndSendAnswer(answer, connection);
    });
  };

  setLocalInfoAndSendAnswer = (answer, connection) => {
    answer.sdp = preferOpus(answer.sdp);
    connection.setLocalDescription(answer);
    const message = {
      type: 'answer',
      data: {
        message: answer,
        toUser: connection.remoteUser,
        fromUser: this.props.userInfo
      }
    };
    this.props.dataFn.listAppend(message);
  };

  handleRemoteHangUp = remoteConnection => {
    if (!isUndefined(remoteConnection) && this.state.mode === 'calling') {
      let newRemotes;
      if (remoteConnection.getRemoteStreams() !== null) {
        newRemotes = this.state.remote.filter(({ stream }) => {
          if (stream === remoteConnection.getRemoteStreams()[0]) {
            stream.getTracks().forEach(track => track.stop());
            return false;
          } else {
            return true;
          }
        });
      }

      remoteConnection.close();

      this.connections = without(this.connections, remoteConnection);

      this.setState({
        mode: 'calling',
        remote: newRemotes
      });
    }
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    this.connections = [];
    this.state = { mode: 'notReady' };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.props.activityData.config.sdpConstraints)
      .then(this.gotStream)
      .catch(e => {
        console.warn('Not able to get camera: ' + e.name);
      });
  }

  gotStream = stream => {
    this.setState(
      {
        mode: 'readyToCall',
        local: {
          src: window.URL.createObjectURL(stream),
          stream
        }
      },
      this.call
    );
  };

  call = () => {
    const message = {
      type: 'join',
      data: {
        room: this.props.groupingValue || 'room',
        fromUser: this.props.userInfo
      }
    };
    this.props.dataFn.listAppend(message);
  };

  componentWillUnmount() {
    if (
      this.state.mode !== 'notReady' &&
      !isUndefined(this.state.local.stream)
    ) {
      this.state.local.stream.getTracks().forEach(track => track.stop());
    }

    if (this.state.mode === 'calling') {
      if (this.state.remote.length > 0) {
        this.state.remote.forEach(({ stream }) => {
          stream.getTracks().forEach(track => track.stop());
        });
      }

      if (this.connections.length > 0) {
        this.connections.forEach(connection => {
          connection.close();
        });
      }

      this.connections = [];
      this.setState({
        mode: 'hangUp'
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (difference(nextProps.data, this.props.data).length > 0) {
      const newMess = last(nextProps.data);
      if (!isEqual(newMess.data.fromUser, this.props.userInfo)) {
        if (newMess.type === 'join' && this.state.mode !== 'notReady') {
          const connection = this.startConnection(newMess.data.fromUser);
          if (connection) {
            this.startOffer(connection);
          }
        } else if (isEqual(newMess.data.toUser, this.props.userInfo)) {
          switch (newMess.type) {
            case 'offer': {
              const connectionOffer = this.startConnection(
                newMess.data.fromUser
              );
              if (connectionOffer) {
                connectionOffer.setRemoteDescription(
                  new RTCSessionDescription(newMess.data.message)
                );
                this.startAnswer(connectionOffer);
              }
              break;
            }
            case 'answer': {
              this.findConnectionByRemoteUser(
                newMess.data.fromUser
              ).setRemoteDescription(
                new RTCSessionDescription(newMess.data.message)
              );
              break;
            }
            case 'candidate': {
              const candidate = new RTCIceCandidate({
                sdpMLineIndex: newMess.data.label,
                candidate: newMess.data.candidate
              });
              this.findConnectionByRemoteUser(
                newMess.data.fromUser
              ).addIceCandidate(candidate);
              break;
            }
            default: {
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

  render() {
    const { activityData, groupingValue, userInfo } = this.props;
    return (
      <div id="webrtc">
        <h1>{activityData.config.title}</h1>
        <p>
          You are: {userInfo.name} in group {groupingValue}
        </p>
        <p>{activityData.config.info}</p>
        <div id="videos">
          <LocalVideo src={this.state.local ? this.state.local.src : ''} />
          {this.state.remote ? (
            this.state.remote.map((connection, index) => (
              <RemoteVideo
                key={connection.remoteUser.id}
                index={'remotevideo' + index}
                src={connection.src}
                name={connection.remoteUser.name}
              />
            ))
          ) : (
            <h1>Wait until somebody connects. </h1>
          )}
        </div>
      </div>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
