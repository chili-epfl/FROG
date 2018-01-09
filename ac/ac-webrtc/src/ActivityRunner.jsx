// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';

import { ICEConfig } from './iceServers';
import { LocalVideo, RemoteVideo } from './Video';

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
    let remoteConn = this.findConnectionByRemoteUser(remoteUser)

    if(this.state.mode !== 'notReady'){
      if (_.isUndefined(remoteConn)) {
        let connection = this.createPeerConnection();
        connection.addStream(this.state.local.stream);
        connection.remoteUser = remoteUser;
        this.connections.push(connection);
        return connection;
      } else if (remoteConn.signalingState === 'have-local-offer'){
        if(remoteUser.id > this.props.userInfo.id){
          let connection = this.createPeerConnection();
          connection.addStream(this.state.local.stream);
          connection.remoteUser = remoteUser;
          this.connections.push(connection); 
          this.handleRemoteHangUp(remoteConn); 
          return connection;
        }else{
          console.log("wait for answer"); 
        }
      }
      else {
        console.log("not local offfer"); 
      }
    }else{
      console.log("not ready yet"); 
    }
  };

  createPeerConnection = () => {
    try {
      let conn = new RTCPeerConnection(ICEConfig);
      conn.onicecandidate = this.handleIceCandidate;
      conn.onaddstream = this.handleRemoteStreamAdded;
      // conn.ontrack = this.handleOnTrack;
      conn.oniceconnectionstatechange = this.handleIceChange;
      return conn;
    } catch (e) {
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  };

  handleIceCandidate = event => {
    if (event.candidate) {
      let message = {
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
      console.log(this.connections); 
    }
  };

  handleRemoteStreamAdded = event => {
    let index = _.indexOf(this.connections, event.target);
    if(this.state.mode === 'calling'){
      console.log("remote stream added");
      let remotes = this.state.remote;
      if (_.isUndefined(remotes[index])) {
        remotes[index] = {
          stream: event.stream,
          src: window.URL.createObjectURL(event.stream),
          remoteUser: this.connections[index].remoteUser
        };
      } else {
        alert('ERROR on remote stream indexes');
      }
      this.setState({
        mode: 'calling',
        remote: remotes
      });
    }else if (this.state.mode === 'readyToCall'){
      console.log("remote stream added");
      let remotes = [];
      remotes[index] = {
        stream: event.stream,
        src: window.URL.createObjectURL(event.stream),
        remoteUser: this.connections[index].remoteUser
      };
      this.setState({
        mode: 'calling',
        remote: remotes
      });
    } else {
      alert('ERROR on remote stream indexes');
    }  

  };

  handleIceChange = event => {
    console.log("change event", event);
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
    offer.sdp = this.preferOpus(offer.sdp);
    connection.setLocalDescription(offer);
    let message = {
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
    answer.sdp = this.preferOpus(answer.sdp);
    connection.setLocalDescription(answer);
    let message = {
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

      // includes connection? then close it
      // filter where comperes
      
      try {
        remoteConnection.close();
      } catch (e) {
        console.log('error closing connection' + e);
      }

      _.pull(this.connections, remoteConnection);

      this.setState({
        mode: 'calling',
        remote: newRemotes
      });
    }
  };

  // Set Opus as the default audio codec if it's present.
  preferOpus = sdp => {
    console.log('Preferring opus');
    var sdpLines = sdp.split('\r\n');
    var mLineIndex;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
    }
    if (mLineIndex === (null || undefined)) {
      return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('opus/48000') !== -1) {
        var opusPayload = this.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
        if (opusPayload) {
          sdpLines[mLineIndex] = this.setDefaultCodec(
            sdpLines[mLineIndex],
            opusPayload
          );
        }
        break;
      }
    }

    // Remove CN in m line and sdp.
    sdpLines = this.removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
  };

  extractSdp = (sdpLine, pattern) => {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
  };

  // Set the selected codec to the first in m line.
  setDefaultCodec = (mLine, payload) => {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
      if (index === 3) {
        // Format of media starts from the fourth.
        newLine[index++] = payload; // Put target payload to the first.
      }
      if (elements[i] !== payload) {
        newLine[index++] = elements[i];
      }
    }
    return newLine.join(' ');
  };

  // Strip CN from sdp before CN constraints is ready.
  removeCN = (sdpLines, mLineIndex) => {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
      var payload = this.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
      if (payload) {
        var cnPos = mLineElements.indexOf(payload);
        if (cnPos !== -1) {
          // Remove CN payload from m line.
          mLineElements.splice(cnPos, 1);
        }
        // Remove CN line in sdp
        sdpLines.splice(i, 1);
      }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
  };

  constructor(props: ActivityRunnerT) {
    console.log("cons"); 
    super(props);

    this.connections = [];
    this.state = { mode: 'notReady'};
  }

  componentDidMount() {
    console.log("mount"); 
    navigator.mediaDevices
      .getUserMedia(this.props.activityData.config.sdpConstraints)
      .then(this.gotStream)
      .catch(function(e) {
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
    let message = {
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
    let message = {
      type: 'bye',
      data: {
        fromUser: this.props.userInfo
      }
    };

    if(this.state.mode !== 'notReady'){
      console.log("unmounting local stream"); 
      if (this.state.local.stream) {
        try {
          this.state.local.stream.getTracks().forEach(track => track.stop());
        } catch (e) {
          console.log('error getting audio or video tracks' + e);
        }
      }
    }

    if(this.state.mode === 'calling'){
      if (this.state.remote.length > 0) {
        _.each(this.state.remote, ({ stream }) => {
          try {
            stream.getTracks().forEach(track => track.stop());
          } catch (e) {
            console.log('error getting audio or video tracks' + e);
          }
        });
      }

      if (this.connections.length > 0) {
        _.each(this.connections, connection => {
          try {
            connection.close();
          } catch (e) {
            console.log('error closing connection', e);
          }
        });
      }

      this.connections = [];
      this.setState({
        mode: 'hangUp'
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (_.difference(nextProps.data, this.props.data).length > 0) {
      let newMess = _.last(nextProps.data);
      if (!_.isEqual(newMess.data.fromUser, this.props.userInfo)) {
        switch (newMess.type){
          case 'join':
            if(this.state.mode !== 'notReady' && newMess.data.fromUser.id != this.props.userInfo.id){
              let connection = this.startConnection(newMess.data.fromUser);
              if (connection) {
                this.startOffer(connection);
              }
            };
            break;
          default :
            if (_.isEqual(newMess.data.toUser, this.props.userInfo)) {
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
            break;
        }
      }        
      return false;
    // } else if(!_.isEqual(nextState, this.state)){
    //   console.log("CHANGE IN state", nextState, this.state);
    //   switch (nextState.mode){
    //     case 'notReady' : 
    //       console.log("not ready"); 
    //       break;
    //     case 'readyToCall' :
    //       console.log("ready"); 
    //       console.log(this.props.dataFn); 
    //       // this.call(); 
    //       break;
    //     case 'calling' : 
    //       console.log("calling");
    //       break;
    //     case 'hangUp' : 
    //       console.log("hangup");
    //       break;
    //     case 'normal' : 
    //       console.log("normal");
    //       break;
    //     case 'readOnly' : 
    //       console.log("readonly");
    //       break;    
    //   }

      
    //   return true; 
    // } else if (!_.isEqual(nextProps.dataFn, this.props.dataFn)){
    //   console.log("NOT EQUAL");
    //   console.log(nextProps.dataFn);  

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
            <h1>Wait until anybody connects. </h1>
          )}
        </div>
      </div>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
