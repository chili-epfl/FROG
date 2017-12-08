// @flow

import React, {Component} from 'react';
import type {ActivityRunnerT} from 'frog-utils';
// import ReconnectingWebSocket from 'reconnectingwebsocket';

const LocalVideo = ({src}) => {
  return(
      <video id="localVideo" height="200px" autoPlay="true" muted="true" src={src}></video>
  );
};

const RemoteVideo = ({src, index}) => (
  <video id={index} autoPlay="true" height="200px" muted="false" src={src}></video>
);

class ActivityRunner extends Component{

  pcConfig = {
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

  state: {
    local: {
      src: string,
      stream: string
    },
    remote: []
  };

  findConnectionByRemoteUser = (userInfo) => {
    return(_.find(this.connections, (conn) => {
      return(_.isEqual(conn.remoteUser,userInfo))
    }))
  };

  startConnection = (remoteUser) => {
    // CHECK if correct! Might be causing problems
    if (!_.contains(this.connections, {remoteUser : remoteUser}) && typeof this.state.local.stream !== 'undefined'){
      var connection = this.createPeerConnection();
      connection.addStream(this.state.local.stream);
      connection.remoteUser = remoteUser;
      this.connections.push(connection);
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
          fromUser: this.props.userInfo
        }
      };   
      // this.ws.send(JSON.stringify(message));
      this.props.dataFn.listAppend(message);
    } else {
      console.log("End of candidates."); 
    };
  };

  handleRemoteStreamAdded = (event) => {
    let index = _.indexOf(this.connections, event.target);
    let remotes = this.state.remote;
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
  };

  handleRemoteStreamRemoved = (event) => {
    console.log("Remote stream removed. Event: ", event); 
  };

  startOffer = (connection) => {
    connection.createOffer(this.props.activityData.config.sdpConstraints)
    .then( (offer) => {
      this.setLocalInfoAndSendOffer(offer, connection)
    }).catch(this.handleCreateOfferError)

  };

  handleCreateOfferError = (event) => {
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
        fromUser: this.props.userInfo
      }
    };
    // this.ws.send(JSON.stringify(message));
    this.props.dataFn.listAppend(message);

  };

  startAnswer = (connection) => {
    connection.createAnswer()
    .then( (answer) => {
      this.setLocalInfoAndSendAnswer(answer, connection)
    }).catch(this.onCreateSessionDescriptionError);
  };

  setLocalInfoAndSendAnswer = (answer, connection) => {
    answer.sdp = this.preferOpus(answer.sdp);
    connection.setLocalDescription(answer);
    let message = {
      type: 'answer',
      data:{
        message: answer,
        toUser: connection.remoteUser,
        fromUser: this.props.userInfo
      }
    }; 
    // this.ws.send(JSON.stringify(message));
    this.props.dataFn.listAppend(message);
  };

  onCreateSessionDescriptionError = (error) =>{
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
      this.connections = _.filter(this.connections, (conn) => {
        if (conn === connection){
          try{
            conn.close();
          }catch(e){
            console.log("error closing connection" +e); 
          }
          return false;
        }else{return true}
      });
      this.setState({
        remote: newRemotes
      })
    }
  };

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


  constructor(props: ActivityRunnerT) {
    console.log("CONSTRUCTING"); 
    super(props);



    this.connections = [];
    this.state = {
      local: {
        src: 'null',
        stream: 'null'
      },
      remote: []
    };

  };

  componentWillMount() {
    console.log("WILL MOUNT"); 
    navigator.mediaDevices.getUserMedia(this.props.activityData.config.sdpConstraints)
    .then(this.gotStream)
    .catch(function(e) {
      alert('getUserMedia() error: ' + e.name);
    });
  }

  gotStream = (stream) => {
    this.setState(
      {
        local: {
          src : window.URL.createObjectURL(stream),
          stream: stream
        }
      }
    );
    this.call();
  };

  call = () => {
    console.log("CALLING"); 
    let message = {
      type: 'create or join',
      data:{
        room: this.props.groupingValue || 'room',
        user: this.props.userInfo
      }
    }; 
    // this.ws.send(JSON.stringify(message));
    this.props.dataFn.listAppend(message);
  };

  componentWillUnmount() {
    console.log("WILL UNMOUNT"); 
    let message = {
      type: 'bye'
    }; 
    // this.ws.send(JSON.stringify(message));
    this.props.dataFn.listAppend(message);
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

    if(this.connections.length > 0){
      _.each(this.connections, (connection) => {
        try{
          connection.close();
        }catch(e){
          console.log("error closing connection", e); 
        }
      })
    };

    this.connections = [];
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log("SHOULD UPDATE"); 
    if(_.difference(this.state, nextState)){
      console.log("CHANGE STATE"); 
      return true;
    }
    if(_.difference(nextProps.data, this.props.data)){
      console.log("CHANGE PROPS");
      return false; 
    } else{
      console.log(nextProps.data, this.props.data); 
    }
    // Once it works then check the type of new message

    // if(!_.isEqual(nextProps.data, this.props.data)){
    //   let newMess = _.last(nextProps.data);
    //   console.log("NEW MESS"); 
    //   switch (newMess.type){
    //     case 'created':
    //       console.log("CREATED"); 
    //       break;
    //     case 'joined':
    //       console.log("JOINED");
    //       break;
    //     case 'join':
    //       console.log("JOIN");
    //       // let connection = this.startConnection(JSONmess.data.user); 
    //       // if (connection) {
    //       //   this.startOffer(connection);
    //       // }; 
    //       break;
    //     case 'offer':
    //       console.log("OFFER");
    //       // let connectionOffer = this.startConnection(JSONmess.data.fromUser); 
    //       // if (connectionOffer) {
    //       //   connectionOffer.setRemoteDescription(new RTCSessionDescription(JSONmess.data.message));
    //       //   this.startAnswer(connectionOffer);
    //       // }; 
    //       break;
    //     case 'answer' :
    //       console.log("ANSWER");
    //       // this.findConnectionByRemoteUser(JSONmess.data.fromUser).setRemoteDescription(new RTCSessionDescription(JSONmess.data.message));
    //       break;
    //     case 'candidate' :
    //       console.log("CANDIDATE");
    //       // let candidate = new RTCIceCandidate({
    //       //   sdpMLineIndex: JSONmess.data.label,
    //       //   candidate: JSONmess.data.candidate
    //       // });
    //       // this.findConnectionByRemoteUser(JSONmess.data.fromUser).addIceCandidate(candidate);
    //       break;
    //     case 'bye' :
    //       console.log("BYE");
    //       // this.handleRemoteHangUp(JSONmess.data);
    //       break;
    //     case 'log' :
    //       console.log("LOG");
    //       // console.log(JSONmess);
    //       break;  
    //     default :
    //       console.log("DEFAUL");
    //       // console.log(JSONmess.type);  
    //   }
    // }
  }

  render() {
    const { activityData, data, dataFn, groupingValue, userInfo, logger, stream } = this.props;
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
        </div>
    );
  }

}


ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;

