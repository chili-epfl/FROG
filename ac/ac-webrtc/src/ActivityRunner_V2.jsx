// @flow

import React, {Component} from 'react';
import {uuid} from 'frog-utils';
import type {ActivityRunnerT} from 'frog-utils';

const LocalVideo = ({src}) => {
  return(
    <div>
      <video id="localVideo" autoPlay="true" muted="true" src={src}></video>
    </div>
  );
};

const RemoteVideo = () => (
  <video id="remoteVideo" autoPlay="true" muted="false"></video>
);

const constraints = {
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
    connections: [],
    ws: WebSocket,
    readyStart: boolean,
    readyCall: boolean,
    readyHangup: boolean
  };

  startConnection = (remoteUser) => {
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
      // conn.onicecandidate = handleIceCandidate;
      // conn.onaddstream = handleRemoteStreamAdded;
      // conn.onremovestream = handleRemoteStreamRemoved;
      return (conn);
    } catch (e) {
      alert('Cannot create RTCPeerConnection object.');
      return;
    }
  };

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
          if (connection) {console.log("DO CALL"); }; 
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
          break;
        case 'answer' :
          console.log("ANSWER");
          console.log(JSONmess.data);
          break;
        case 'candidate' :
          console.log("CANDIDATE");
          console.log(JSONmess.data);
          break;
        case 'bye' :
          console.log("BYE");
          console.log(JSONmess.data);
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

    const {data, dataFn, activityData} = props;

    
    this.state = {
      id: uuid(),
      local: {
        src: 'null',
        stream: 'null'
      },
      ws: wsRTC,
      readyStart: false,
      readyCall: true,
      readyHangup: false
    };

  };

  render() {
    const { activityData, data, dataFn, userInfo, logger, stream } = this.props;

    const onStart = () => {
      console.log(constraints); 
      navigator.mediaDevices.getUserMedia(constraints)
      .then(gotStream)
      .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
      });
      let message = {
        type: 'message'
      }; 
      console.log(JSON.stringify(message));
      this.state.ws.send(JSON.stringify(message));
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
      if (this.state.local.stream){
        try{
          this.state.local.stream.getTracks().forEach(track => track.stop());
        }catch(e){
          console.log("error getting audio or video tracks" + e); 
        }
        this.setState(
          {
            local: {
              src : 'null',
              stream: 'null'
            },
            readyStart: true,
            readyHangup: false
          }
        );
        let message = {
          type: 'bye'
        }; 
        console.log(JSON.stringify(message));
        this.state.ws.send(JSON.stringify(message));
      };
    };


    return(
        <div id="webrtc">
          <h1>{activityData.config.title}</h1>
          <div id="videos">
            <LocalVideo src={this.state.local.src} stream={this.state.local.stream}/>
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

