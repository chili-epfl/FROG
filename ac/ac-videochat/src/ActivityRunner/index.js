// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';
import * as KurentoUtils from 'kurento-utils';

import { isUndefined, isEqual, without, difference, last } from 'lodash';

import { ICEConfig } from '../utils/iceServers';
import { preferOpus } from '../utils/codec';
import Header from './Header';
import VideoLayout from './VideoLayout';

declare var RTCPeerConnection: any;
declare var RTCIceCandidate: any;
declare var RTCSessionDescription: any;
declare var navigator: any;

type StateT = {
  mode: string,
  local: Object,
  remote: Array<any>
};

class ActivityRunner extends Component<ActivityRunnerT, StateT> {
  connections: Array<any>;


  findConnectionByRemoteUser = userInfo =>
    this.connections.find(conn => isEqual(conn.remoteUser, userInfo));

  startConnection = remoteUser => {
    const remoteConn = this.findConnectionByRemoteUser(remoteUser);

    if (this.state.mode !== 'notReady') {
      if (!remoteConn) {
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
      if (this.state.mode === 'readyToCall' || this.state.mode === 'calling') {
        conn.addStream(this.state.local.stream);
      }
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
      if (
        remoteConnection.getRemoteStreams() !== null &&
        this.state.mode === 'calling'
      ) {
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
    this.state = { mode: 'notReady', local: {}, remote: [] };
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.props.activityData.config.sdpConstraints)
      .then(this.gotStream)
      .catch(e => {
        console.warn('Not able to get camera: ', e);
      });
  }

  gotStream = stream => {
    this.setState(
      {
        mode: 'readyToCall',
        local: {
          user: this.props.userInfo.name,
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
      (this.state.mode === 'calling' || this.state.mode === 'readyToCall') &&
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
              const cbru = this.findConnectionByRemoteUser(
                newMess.data.fromUser
              );
              if (cbru) {
                cbru.setRemoteDescription(
                  new RTCSessionDescription(newMess.data.message)
                );
              }
              break;
            }
            case 'candidate': {
              const candidate = new RTCIceCandidate({
                sdpMLineIndex: newMess.data.label,
                candidate: newMess.data.candidate
              });
              const cbru = this.findConnectionByRemoteUser(
                newMess.data.fromUser
              );
              if (cbru) {
                cbru.addIceCandidate(candidate);
              }
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
    //console.warn('test');

    const local =
      this.state.mode === 'readyTocall' || this.state.mode === 'calling'
        ? this.state.local
        : {};
    const remote = this.state.mode === 'calling' ? this.state.remote : [];
    return (
      <div id="webrtc">
        <Header {...this.props} />
        <VideoLayout local={local} remote={remote} />
      </div>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
