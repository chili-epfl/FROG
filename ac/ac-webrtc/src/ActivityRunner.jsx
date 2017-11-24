// @flow

/*********

import React, { Component } from 'react';
import {uuid} from 'frog-utils';
import type { ActivityRunnerT } from 'frog-utils';

import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = (encoding) => {
    // do nothing
  }
}

import io from 'socket.io-client';
// var io = require('socket.io-client');


const LocalVideo = ({src}) => {
  return(
    <div>
      <video id="localVideo" autoPlay="true" muted="true" src={src}></video>
    </div>
  );
};

// const RemoteVideo = () => (
//   <video id="remoteVideo" autoPlay="true" muted="false"></video>
// );

const constraints = {
  audio: true,
  video: true
};



class ActivityRunner extends Component{
  // state: {
  //   id: string,
  //   local: {
  //     src: string,
  //     stream: string
  //   },
  //   socket: socket
  // };

  constructor(props: ActivityRunnerT) {
    super(props);

    // const sRTC = io.connect('https:////138.197.182.1:8080');

    // sRTC.on('created', (room) => {
    //   console.log('CREATION: >>>> Created room ' + room);
    // });

    // sRTC.on('full', (room) => {
    //   alert('FULL: >>>> Room ' + room + ' is full');
    //   onHangUp();
    // });

    // sRTC.on('join', (room, remoteId) =>{
    //   console.log('JOIN: >>>>  Another peer made a request to join room ' + room + ' go ahead and add it ' + remoteId);
    //   // isChannelReady = true;
    //   // var conn = maybeStart(remoteId);
    //   // if (conn) {doCall(conn)};
    // });

    // sRTC.on('joined', (room, numClients) => {
    //   console.log('JOINED: >>>> ' + room + ' there is ' + numClients + ' other than you');
    // });



    // const {data, dataFn, activityData} = props;
    // this.state = {
    //   id: uuid(),
    //   local: {
    //     src: 'null',
    //     stream: 'null'
    //   },
    //   ws: sRTC
    // };

  };

  render() {
    const { activityData, data, dataFn, userInfo, logger, stream } = this.props;

    // const onStart = () => {
    //   console.log(constraints); 
    //   navigator.mediaDevices.getUserMedia(constraints)
    //   .then(gotStream)
    //   .catch(function(e) {
    //     alert('getUserMedia() error: ' + e.name);
    //   });
    // };

    // const gotStream = (stream) => {
    //   this.setState(
    //     {
    //       local: {
    //         src : window.URL.createObjectURL(stream),
    //         stream: stream
    //       }
    //     }
    //   );
    //   // LocalVideo(streams.local);
    //   // localVideo.src = window.URL.createObjectURL(stream);
    //   // localVideo.stream = stream;
    //   // startButton.disabled = true;
    // };

    // const onCall = () => {
    //   console.log("HELLO");
    //   this.state.ws.send({'create or join' : 'hello'});
    // };

    // const onHangUp = () => {
    //   if (this.state.local.stream){
    //     try{
    //       this.state.local.stream.getTracks().forEach(track => track.stop());
    //     }catch(e){
    //       console.log("error getting audio or video tracks" + e); 
    //     }
    //     this.setState(
    //       {
    //         local: {
    //           src : 'null',
    //           stream: 'null'
    //         }
    //       }
    //     );
    //   };
    // };


    // return(
    //     <div id="webrtc">
    //       <h1>{activityData.config.title}</h1>
            
    //       <LocalVideo src={this.state.local.src} />
          
    //       <div>
    //           <button id="startButton" onClick={onStart}>Start</button>
    //           <button id="callButton" onClick={onCall}>Call</button>
    //           <button id="hangupButton" onClick={onHangUp}>Hang Up</button>
    //       </div>
    //     </div>
    // );
    return(
      <div id="webrtc">
        <button>Hello</button>
      </div>
    );
  }

}


ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;

// export default ActivityRunner;






















***************/










console.log("this is me")



import React, {Component} from 'react';
import {uuid} from 'frog-utils';
import type {ActivityRunnerT} from 'frog-utils';
// var WebSocket = require('ws');
import WebSocket from 'ws';


// const LocalVideo = ({src}) => {
//   return(
//     <div>
//       <video id="localVideo" autoPlay="true" muted="true" src={src}></video>
//     </div>
//   );
// };

// const RemoteVideo = () => (
//   <video id="remoteVideo" autoPlay="true" muted="false"></video>
// );

const constraints = {
  audio: true,
  video: true
};



class ActivityRunner extends Component{
  state: {
    id: string,
    local: {
      src: string,
      stream: string
    },
    ws: WebSocket
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    const wsRTC = new WebSocket('ws://138.197.182.1:8080/socket.io/?EIO=3&transport=websocket');
    // window.ruru = [];

    // //Connect
    // wsRTC.onopen = (event) => {
    //   console.log('CREATION: >>>> Created room ' + event);
    //   window.eventu = event;
    //   window.wss = wsRTC;
    // };

    // // Log errors
    // wsRTC.onerror = (error) => {
    //   console.log('WebSocket Error ' + error);
    // };

    // // Log messages from the server
    // wsRTC.onmessage = (e) => {
    //   console.log('Server: ' + e.data);
    //   ruru.push(e);
    // };

    // wsRTC.oncreated = (room) => {
    //   console.log('CREATION: >>>> Created room ' + room);
    // };

    // wsRTC.onfull = (room) => {
    //   alert('FULL: >>>> Room ' + room + ' is full');
    //   onHangUp();
    // };

    // wsRTC.onjoin =  (room, remoteId) =>{
    //   console.log('JOIN: >>>>  Another peer made a request to join room ' + room + ' go ahead and add it ' + remoteId);
    //   // isChannelReady = true;
    //   // var conn = maybeStart(remoteId);
    //   // if (conn) {doCall(conn)};
    // };

    // wsRTC.onjoined = (room, numClients) => {
    //   console.log('JOINED: >>>> ' + room + ' there is ' + numClients + ' other than you');
    // };



    // const {data, dataFn, activityData} = props;
    this.state = {
      id: uuid(),
      local: {
        src: 'null',
        stream: 'null'
      },
      ws: wsRTC
    };

  };

  render() {
    const { activityData, data, dataFn, userInfo, logger, stream } = this.props;

    // const onStart = () => {
    //   console.log(constraints); 
    //   navigator.mediaDevices.getUserMedia(constraints)
    //   .then(gotStream)
    //   .catch(function(e) {
    //     alert('getUserMedia() error: ' + e.name);
    //   });
    // };

    // const gotStream = (stream) => {
    //   this.setState(
    //     {
    //       local: {
    //         src : window.URL.createObjectURL(stream),
    //         stream: stream
    //       }
    //     }
    //   );
    //   // LocalVideo(streams.local);
    //   // localVideo.src = window.URL.createObjectURL(stream);
    //   // localVideo.stream = stream;
    //   // startButton.disabled = true;
    // };

    // const onCall = () => {
    //   console.log("HELLO");
    //   this.state.ws.send({'create or join' : 'hello'});
    // };

    // const onHangUp = () => {
    //   if (this.state.local.stream){
    //     try{
    //       this.state.local.stream.getTracks().forEach(track => track.stop());
    //     }catch(e){
    //       console.log("error getting audio or video tracks" + e); 
    //     }
    //     this.setState(
    //       {
    //         local: {
    //           src : 'null',
    //           stream: 'null'
    //         }
    //       }
    //     );
    //   };
    // };


    return(
        <div id="webrtc">
          <h1>{activityData.config.title}</h1>
            
          <LocalVideo src={this.state.local.src} />          

          <div>
              <button id="startButton" onClick={onStart}>Start</button>
              <button id="callButton" onClick={onCall}>Call</button>
              <button id="hangupButton" onClick={onHangUp}>Hang Up</button>
          </div>
      
        </div>
    );
  }

}


ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;

// export default ActivityRunner;





























//something

/*******************

  the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => {
  const id = uuid();

  componentWillMount() {
    window.caca = data;
    dataFn.objInsert(
      {
        local: {
           src: 'null',
           stream: 'null'
        }
      }, id
    );
    logger(data);
  }

  const onStart = () => {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(function(e) {
      alert('getUserMedia() error: ' + e.name);
    });
  };

  const gotStream = stream => {
    dataFn.streams.local.src = window.URL.createObjectURL(stream);
    window.streams = streams;
    window.localv = LocalVideo;
    // LocalVideo(streams.local);
    // localVideo.src = window.URL.createObjectURL(stream);
    // localVideo.stream = stream;
    // startButton.disabled = true;
  };

  const hangUp = () => {
    if (localVideo.stream){
      try{
        localVideo.stream.getTracks().forEach(track => track.stop());
      }catch(e){
        console.log("error getting audio or video tracks" + e); 
      }
      localVideo.stream = null;
    }
  };

  return(
    <div id="webrtc">
      <h1>{activityData.config.title}</h1>
        <div id="videos">
          {logger(data)}
          <LocalVideo src={data.id.local.src}/>
        </div>
      
      <div>
          <button id="startButton" onClick={onStart}>Start</button>
          <button id="callButton">Call</button>
          <button id="hangupButton" onClick={hangUp}>Hang Up</button>
      </div>

    </div>
  )
}; **************************************/












































/***********************************************************************

                              VERSION 1

// @flow

import React from 'react';
import type {ActivityRunnerT} from 'frog-utils';

const LocalVideo = ({src, stream}) => (
  <video id="localVideo" autoPlay="true" muted="true" src={src}></video>
);

const RemoteVideo = () => (
  <video id="remoteVideo" autoPlay="true" muted="false"></video>
);

const constraints = {
  audio: true,
  video: true
};

const streams = {
  local: {
    src: 'null',
    stream: 'null'
  }
}

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => {
  const onStart = () => {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(function(e) {
      alert('getUserMedia() error: ' + e.name);
    });
  };

  const gotStream = stream => {
    localVideo.src = window.URL.createObjectURL(stream);
    localVideo.stream = stream;
    startButton.disabled = true;
  };

  const hangUp = () => {
    if (localVideo.stream){
      try{
        localVideo.stream.getTracks().forEach(track => track.stop());
      }catch(e){
        console.log("error getting audio or video tracks" + e); 
      }
      localVideo.stream = null;
    }
  };

  const streams = {
    local: {
      src: 'null',
      stream: 'null'
    }
  }

  return(
    <div id="webrtc">
      <h1>{activityData.config.title}</h1>
        <div id="videos">
          <LocalVideo src={streams.local.src} stream={streams.local.stream}/>
        </div>
      
      <div>
          <button id="startButton" onClick={onStart}>Start</button>
          <button id="callButton">Call</button>
          <button id="hangupButton" onClick={hangUp}>Hang Up</button>
      </div>

    </div>
  )
};

export default ActivityRunner;

*********************************************************************/