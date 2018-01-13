// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';

import { ICEConfig } from './iceServers';
import { LocalVideo, RemoteVideo } from './Video';
import { preferOpus } from './codec';

type StateT = 
  | { mode: 'notReady' }
  | { mode: 'readyToCall', local: Object}
  | { mode: 'calling', local: Object, remote: Array }
  | { mode: 'hangUp' };

class ActivityRunner extends Component {
  state: StateT;

  findConnectionByRemoteUser = userInfo => {
    return _.find(this.connections, conn => {
      return _.isEqual(conn.remoteUser, userInfo);
    });
  };

  startConnection = remoteUser => {
    const remoteConn = this.findConnectionByRemoteUser(remoteUser)

    if(this.state.mode !== 'notReady'){
      if (_.isUndefined(remoteConn)) {
        return( this.createPeerConnection(remoteUser) );
      } else if (remoteConn.signalingState === 'have-local-offer' || (remoteConn.signalingState ==='stable' && remoteConn.localDescription.type === "")){
        if(remoteUser.id > this.props.userInfo.id){
          this.handleRemoteHangUp(remoteConn); 
          return this.createPeerConnection(remoteUser);
        }
      }
    }else{
      console.log("not ready yet"); 
    }
  };

  createPeerConnection = (remoteUser) => {
    try {
      let conn = new RTCPeerConnection(ICEConfig);
      conn.onicecandidate = this.handleIceCandidate;
      conn.onaddstream = this.handleRemoteStreamAdded;
      conn.oniceconnectionstatechange = this.handleIceChange;
      conn.addStream(this.state.local.stream);
      conn.remoteUser = remoteUser;
      this.connections.push(conn)
      return conn;
    } catch (e) {
      alert('Cannot create RTCPeerConnection object.');
      return;
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
    } else {
      console.log('End of candidates.');
    }
  };

  handleRemoteStreamAdded = event => {
    const index = this.connections.findIndex(x => x.remoteUser === event.currentTarget.remoteUser);
    let remotes = [];  
    switch(this.state.mode){
      case 'readyToCall':
        this.addRemoteStream(remotes, index, event.stream);
        break;
      case 'calling':
        remotes = this.state.remote;
        if (_.isUndefined(remotes[index])) {
          this.addRemoteStream(remotes, index, event.stream);
        } else {
          alert('ERROR on remote stream indexes');
        }
        break;
      default :
        alert('ERROR on state');
        break;
    }  

  };

  addRemoteStream = (remotes, index, stream) => {  
    remotes[index] = {
      stream: stream,
      src: window.URL.createObjectURL(stream),
      remoteUser: this.connections[index].remoteUser
    };
    this.setState({
      mode: 'calling',
      remote: remotes
    });
  }

  handleIceChange = event => {
    if (event.target.iceConnectionState === "failed" ||
    event.target.iceConnectionState === "disconnected" ||
    event.target.iceConnectionState === "closed") {
      this.handleRemoteHangUp(event.target);
    }
  };

  startOffer = connection => {
    connection
      .createOffer(this.props.activityData.config.sdpConstraints)
      .then(offer => {
        this.setLocalInfoAndSendOffer(offer, connection);
      })
      .catch(this.handleCreateOfferError);
  };

  handleCreateOfferError = event => {
    console.log('createOffer() error:', event);
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
    connection
      .createAnswer()
      .then(answer => {
        this.setLocalInfoAndSendAnswer(answer, connection);
      })
      .catch(this.onCreateSessionDescriptionError);
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

  onCreateSessionDescriptionError = error => {
    console.log('Failed to create description: ', error.toString());
  };

  handleRemoteHangUp = remoteConnection => {
    console.log('Session terminated', remoteConnection);
    if (!_.isUndefined(remoteConnection) && this.state.mode !== 'notReady') {
      let newRemotes;
      if (remoteConnection.getRemoteStreams() !== null) {
        newRemotes = _.filter(this.state.remote, ({ stream }) => {
          if (stream == remoteConnection.getRemoteStreams()[0]) {
            try {
              stream.getTracks().forEach(track => track.stop());
            } catch (e) {
              console.log('error getting audio or video tracks' + e);
            }
            return false;
          } else {
            return true;
          }
        });
      }
    
      try {
        remoteConnection.close();
      } catch (e) {
        console.log('error closing connection' + e);
      }

      this.connections = _.without(this.connections, remoteConnection);

      this.setState({
        mode: 'calling',
        remote: newRemotes
      });
    }
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    this.connections = [];
    this.state = { mode: 'notReady'};
  }

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.props.activityData.config.sdpConstraints)
      .then(this.gotStream)
      .catch(function(e) {
        console.log("Error:", e); 
        alert('getUserMedia() error: ' + e.name);
      });
  }

  gotStream = stream => {
    this.setState({ 
      mode : 'readyToCall',
      local: {
        src: window.URL.createObjectURL(stream),
        stream: stream
      }
    }, this.call);
  };

  call = () => {
    const message = {
      type: 'join',
      data: {
        room: this.props.groupingValue || 'room',
        fromUser: this.props.userInfo
      }
    };
    try{
      this.props.dataFn.listAppend(message);
    }catch (e){
      console.log("ERROR" , e); 
    }

  };

  componentWillUnmount() {
    const message = {
      type: 'bye',
      data: {
        fromUser: this.props.userInfo
      }
    };

    try{
        if(this.state.mode !== 'notReady'){
        console.log("unmounting local stream"); 
        if (this.state.local.stream) {
          this.state.local.stream.getTracks().forEach(track => track.stop());
        }
      }

      if(this.state.mode === 'calling'){
        if (this.state.remote.length > 0) {
          _.each(this.state.remote, ({ stream }) => {
              stream.getTracks().forEach(track => track.stop());
          });
        }

        if (this.connections.length > 0) {
          _.each(this.connections, connection => {
              connection.close();
          });
        }

        this.connections = [];
        this.setState({
          mode: 'hangUp'
        });
      }
    }catch(e){
      console.log("ERROR on unmounting", e); 
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.difference(nextProps.data, this.props.data).length > 0) {
      const newMess = _.last(nextProps.data);
      if (!_.isEqual(newMess.data.fromUser, this.props.userInfo)) {
        if (newMess.type === 'join' && this.state.mode !== 'notReady'){
          let connection = this.startConnection(newMess.data.fromUser);
          if (connection) {
            this.startOffer(connection);
          }
        }  
        else if (_.isEqual(newMess.data.toUser, this.props.userInfo)) {
          switch(newMess.type){
            case 'offer':
              let connectionOffer = this.startConnection(newMess.data.fromUser);
              if (connectionOffer) {
                connectionOffer.setRemoteDescription(new RTCSessionDescription(newMess.data.message));
                this.startAnswer(connectionOffer);
              };
              break;
            case 'answer' :
              this.findConnectionByRemoteUser(newMess.data.fromUser).setRemoteDescription(new RTCSessionDescription(newMess.data.message));
              break;
            case 'candidate' :
              let candidate = new RTCIceCandidate({
                sdpMLineIndex: newMess.data.label,
                candidate: newMess.data.candidate
              });
              this.findConnectionByRemoteUser(newMess.data.fromUser).addIceCandidate(candidate);
              break;
          }
        }
      }        
      return false;
    }else{
      return true;
    }
  }

  render() {
    const {
      activityData,
      groupingValue,
      userInfo
    } = this.props;
    return (
      <div id="webrtc">
        <h1>{activityData.config.title}</h1>
        <p>You are: {userInfo.name} in group {groupingValue}</p>
        <p>{activityData.config.info}</p>
        <div id="videos">
          <LocalVideo
            src={this.state.local ? this.state.local.src : ""}
            stream={this.state.local ? this.state.local.stream : ""}
          />
          {this.state.remote ? (
            this.state.remote.map((connection, index) => (
              <RemoteVideo
                key={index}
                index={'remotevideo' + index}
                src={connection.src}
                stream={connection.stream}
                name = {connection.remoteUser.name}
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
