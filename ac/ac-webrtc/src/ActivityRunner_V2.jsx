// @flow

// ----------------------TODOs:-------------------------
// 1) ReconnectingWebSocket instead of WebSocket
// 2) Move all functions to class functions but not on render
// 3) Use component did mount or will mount or will unmount etc
// 4) Be careful with the change of activity does not call constractor

import React, {Component} from 'react';
import {uuid} from 'frog-utils';
import type {ActivityRunnerT} from 'frog-utils';

// ReconnectingWebSocket 

const LocalVideo = ({src}) => {
  return(
      <video id="localVideo" height="200px" autoPlay="true" muted="true" src={src}></video>
  );
};

const RemoteVideo = ({src, index}) => (
  <video id={index} autoPlay="true" height="200px" muted="false" src={src}></video>
);

const sdpConstraints = {
  audio: true,
  video: true
};

var pcConfig = {
  'iceServers': [
    {
      'urls': 'stun:stun.l.google.com:19302'
    },
    {
      'urls': 'turn:138.197.182.1:3478', 
      'username': 'test', 
      'credential': 'test'
    },
    {
      'urls': 'stun:138.197.182.1:3478', 
      'username': 'test', 
      'credential': 'test'
    }
  ]

};


class ActivityRunner extends Component{
  state: {
    id: string, 
    local: {
      src: string,
      stream: string
    },
    remote: [],
    connections: [],
    ws: WebSocket,
    readyStart: boolean,
    readyCall: boolean,
    readyHangup: boolean
  };

  findConnectionByRemoteUser = (userInfo) => {
    return(_.find(this.state.connections, (conn) => {
      return(_.isEqual(conn.remoteUser,userInfo))
    }))
  };

  startConnection = (remoteUser) => {
    console.log("Start Connection: I am", this.userInfo); 
    console.log("start Connection: I am talking ", remoteUser);
    // CHECK!
    if (!_.contains(this.state.connections, {remoteUser : remoteUser}) && typeof this.state.local.stream !== 'undefined'){
      var connection = this.createPeerConnection();
      connection.addStream(this.state.local.stream);
      connection.remoteUser = remoteUser;
      this.state.connections.push(connection);
      return connection;
    }
  };

  createPeerConnection = () => {
    try {
      var conn = new RTCPeerConnection(pcConfig);
      conn.onicecandidate = this.handleIceCandidate;
      conn.onaddstream = this.handleRemoteStreamAdded;
      conn.onremovestream = this.handleRemoteStreamRemoved;
      return (conn);
    } catch (e) {
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  };

  handleIceCandidate = (event) => {
    if(event.candidate) {
      let message = {
        type: 'candidate',
        data:{
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate,
          toUser: event.target.remoteUser,
          fromUser: this.userInfo
        }
      }; 
      console.log("ICE CANDIDATE I am", this.userInfo);
      console.log("ICE CANDIDATE talking", event.target.remoteUser);  
      console.log(JSON.stringify(message));
      this.state.ws.send(JSON.stringify(message));
    } else {
      console.log("ICE CANDIDATE I am", this.userInfo); 
      console.log("End of candidates."); 
    };
  };

  handleRemoteStreamAdded = (event) => {
    console.log("REMOTE STREAM I am", this.userInfo); 
    let index = _.indexOf(this.state.connections, event.target);
    // let remote = this.state.remote[index];
    
    let remotes = this.state.remote;
    console.log(index, remotes);
    window.remo = remotes; 
    if(_.isUndefined(remotes[index])){
      remotes[index] = {
        stream : event.stream,
        src : window.URL.createObjectURL(event.stream)
      };
    } else {
      alert ("ERROR on remote stream indexes");
    }
    this.setState({
      'remote' : remotes
    });
    console.log(this.state.connections);
  };

  handleRemoteStreamRemoved = (event) => {
    console.log("Remote stream removed. Event: ", event); 
  };

  startOffer = (connection) => {
    connection.createOffer(sdpConstraints)
    .then( (offer) => {
      this.setLocalInfoAndSendOffer(offer, connection)
    }).catch(this.handleCreateOfferError)

  };

  handleCreateOfferError = (event) => {
    console.log("CREATE OFFER ERROR I am", this.userInfo);
    console.log("createOffer() error:", event); 
  };

  setLocalInfoAndSendOffer = (offer, connection) => {
    offer.sdp = this.preferOpus(offer.sdp);
    connection.setLocalDescription(offer);
    let message = {
      type: 'offer',
      data:{
        message: offer,
        toUser: connection.remoteUser,
        fromUser: this.userInfo
      }
    };
    console.log("SET LOCAL AND OFFER I am", this.userInfo);
    console.log("SET LOCAL AND OFFER talking with", connection.remoteUser); 
    console.log(JSON.stringify(message));
    this.state.ws.send(JSON.stringify(message));
  };

  startAnswer = (connection) => {
    connection.createAnswer()
    .then( (answer) => {
      this.setLocalInfoAndSendAnswer(answer, connection)
    }).catch(this.onCreateSessionDescriptionError);
  };

  setLocalInfoAndSendAnswer = (answer, connection) => {
    console.log("SET LOCAL AND ANSWER I am", this.userInfo);
    console.log("SET LOCAL AND ANSWER talking", connection.remoteUser);
    answer.sdp = this.preferOpus(answer.sdp);
    connection.setLocalDescription(answer);
    let message = {
      type: 'answer',
      data:{
        message: answer,
        toUser: connection.remoteUser,
        fromUser: this.userInfo
      }
    }; 
    console.log(JSON.stringify(message));
    this.state.ws.send(JSON.stringify(message));
  };

  onCreateSessionDescriptionError = (error) =>{
    console.log("CREATE SESION ERROR I am", this.userInfo);
    console.log("Failed to create description: ", error.toString()); 
  };

  // requestTurn!



  handleRemoteHangUp = (remoteUser) => {
    console.log("Session terminated", remoteUser); 
    let connection = this.findConnectionByRemoteUser(remoteUser);
    if(connection !== null) {
      let newRemotes;
      if (connection.getRemoteStreams() !== null){
        newRemotes = _.filter(this.state.remote, ({stream}) => {
           if(stream == connection.getRemoteStreams()[0]){
            console.log("OH YUES", stream); 
            try{
              stream.getTracks().forEach(track => track.stop());
            }catch(e){
              console.log("error getting audio or video tracks" + e); 
            }return false;
           } else{
            return true;
           }
        });
      }
      let newConnections = _.filter(this.state.connections, (conn) => {
        if (conn === connection){
          try{
            conn.close();
          }catch(e){
            console.log("error closing connection" +e); 
          }
          return false;
        }else{return true}
      });
      console.log(newRemotes); 
      this.setState({
        remote: newRemotes,
        connections: newConnections
      })
    }
  }

  ////////////////////////

  ///////////////////////////////////////////

  // Set Opus as the default audio codec if it's present.
  preferOpus = (sdp) => {
    console.log("Preferring opus"); 
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
          sdpLines[mLineIndex] = this.setDefaultCodec(sdpLines[mLineIndex],
            opusPayload);
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
      if (index === 3) { // Format of media starts from the fourth.
        newLine[index++] = payload; // Put target payload to the first.
      }
      if (elements[i] !== payload) {
        newLine[index++] = elements[i];
      }
    }
    return newLine.join(' ');
  };

  // Strip CN from sdp before CN constraints is ready.
  removeCN =(sdpLines, mLineIndex) => {
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



  ///////////////////////



  constructor(props: ActivityRunnerT) {
    super(props);

    const wsRTC = new WebSocket('ws://localhost:8080/');
    // let wsRTC = new WebSocket('wss://138.197.182.1:8080/socket.io/?EIO=3&transport=websocket');


    //Connect
    wsRTC.onopen = (event) => {
      console.log('WEBSOCKET OPEN');
    };

    // Log errors
    wsRTC.onerror = (error) => {
      console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    wsRTC.onmessage = (message) => {
      var JSONmess = JSON.parse(message.data);
      // console.log('Message Received: %s');
      // console.log(JSONmess);

      switch (JSONmess.type){
        case 'created':
          console.log("CREATED"); 
          console.log(JSONmess.data);
          break;
        case 'joined':
          console.log("JOINED");
          console.log(JSONmess.data);  
          break;
        case 'join':
          console.log("JOIN");
          console.log(JSONmess.data);
          let connection = this.startConnection(JSONmess.data.user); 
          if (connection) {
            console.log("DO CALL"); 
            this.startOffer(connection);
          }; 
          break;
        case 'full':
          console.log("FULL");
          console.log(JSONmess.data);
          alert("The room " + JSONmess.data.room + " is full. Please try another name");
          this.setState(
            {
              readyCall: true,
              readyHangup: false
            }
          );
          break;
        case 'offer':
          console.log("OFFER");
          console.log(JSONmess.data);
          let connectionOffer = this.startConnection(JSONmess.data.fromUser); 
          if (connectionOffer) {
            console.log("DO ANSWER");
            this.findConnectionByRemoteUser(JSONmess.data.fromUser).setRemoteDescription(new RTCSessionDescription(JSONmess.data.message)); 
            this.startAnswer(connectionOffer);
          }; 
          break;
        case 'answer' :
          console.log("ANSWER");
          console.log(JSONmess.data);
          console.log(this.userInfo); 
          window.st = this.state.connections;
          window.from = JSONmess.data.fromUser;
          console.log(this.state.connections);
          console.log(this.state.connections[0].remoteUser); 
          console.log(JSONmess.data.fromUser);  

          this.findConnectionByRemoteUser(JSONmess.data.fromUser).setRemoteDescription(new RTCSessionDescription(JSONmess.data.message));

          break;
        case 'candidate' :
          console.log("CANDIDATE");
          console.log(JSONmess.data);
          let candidate = new RTCIceCandidate({
            sdpMLineIndex: JSONmess.data.label,
            candidate: JSONmess.data.candidate
          });
          this.findConnectionByRemoteUser(JSONmess.data.fromUser).addIceCandidate(candidate);
          break;
        case 'bye' :
          console.log("BYE");
          console.log(JSONmess.data);
          this.handleRemoteHangUp(JSONmess.data);
          break;
        case 'log' :
          console.log("LOG");
          console.log(JSONmess);
          break;  
        default :
          console.log("DEFAUL");
          console.log(JSONmess.type);  
      }
    };

    const {data, dataFn, activityData, userInfo} = props;

    this.userInfo = userInfo;
    this.state = {
      id: uuid(),
      local: {
        src: 'null',
        stream: 'null'
      },
      remote: [],
      connections: [],
      ws: wsRTC,
      readyStart: true,
      readyCall: false,
      readyHangup: false
    };

  };

  render() {
    const { activityData, data, dataFn, userInfo, logger, stream } = this.props;

    const onStart = () => {
      console.log(sdpConstraints); 
      navigator.mediaDevices.getUserMedia(sdpConstraints)
      .then(gotStream)
      .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
      });
      // let message = {
      //   type: 'message'
      // }; 
      // console.log(JSON.stringify(message));
      // this.state.ws.send(JSON.stringify(message));
    };

    const gotStream = (stream) => {
      this.setState(
        {
          local: {
            src : window.URL.createObjectURL(stream),
            stream: stream
          },
          readyStart: false,
          readyCall: true
        }
      );
      // LocalVideo(streams.local);
      // localVideo.src = window.URL.createObjectURL(stream);
      // localVideo.stream = stream;
      // startButton.disabled = true;
    };

    const onCall = () => {
      this.setState(
        {
          readyCall: false,
          readyHangup: true
        }
      );
      let message = {
        type: 'create or join',
        data:{
          room: 'lala',
          user: userInfo
        }
      }; 
      console.log(JSON.stringify(message));
      this.state.ws.send(JSON.stringify(message));
    };

    const onHangUp = () => {
      let message = {
          type: 'bye'
      }; 
      console.log(JSON.stringify(message));
      this.state.ws.send(JSON.stringify(message));

      if (this.state.local.stream){
        try{
          this.state.local.stream.getTracks().forEach(track => track.stop());
        }catch(e){
          console.log("error getting audio or video tracks" + e); 
        }        
      };

      if (this.state.remote.length >0){
        _.each(this.state.remote, ({stream}) => { 
          try{
           stream.getTracks().forEach(track => track.stop());
          }catch(e){
            console.log("error getting audio or video tracks" + e); 
          }
        })
      };

      if(this.state.connections.length > 0){
        _.each(this.state.connections, (connection) => {
          try{
            connection.close();
          }catch(e){
            console.log("error closing connection", e); 
          }
        })
      };

      this.setState({
        local: {
          src : 'null',
          stream: 'null'
        },
        readyStart: true,
        readyHangup: false,
        remote: [],
        connections: []
      });
    };


    return(
        <div id="webrtc">
          <h1>{activityData.config.title}</h1>
          <div id="videos">
            <LocalVideo src={this.state.local.src} stream={this.state.local.stream}/>
            {this.state.remote.length > 0 ? (this.state.remote.map( (connection, index) => (
                  <RemoteVideo key = {index} index={"remotevideo"+index} src={connection.src} stream={connection.stream}/>)
                )) : ( <h1>You are alone</h1> )
            }
          </div>
        
          <div>
              <button id="startButton" onClick={onStart} disabled={!this.state.readyStart}>Start</button>
              <button id="callButton" onClick={onCall} disabled={!this.state.readyCall}>Call</button>
              <button id="hangupButton" onClick={onHangUp} disabled={!this.state.readyHangup}>Hang Up</button>
          </div>
        
        </div>
    );
  }

}


ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;

