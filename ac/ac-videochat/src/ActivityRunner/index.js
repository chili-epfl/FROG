// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';

import { isUndefined, isEqual, without, difference, last } from 'lodash';

import { rtcConfiguration, signalServerURL } from '../webrtc-config/config';
import { onStreamAdded } from '../analytics/AVStreamAnalysis';
import { preferOpus } from '../utils/codec';
import Header from './Header';
import VideoLayout from './VideoLayout';

export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const Participant = isBrowser
	? require('./participant.js')
  : () => null
  
export const hark = isBrowser
	? require('./hark.bundle.js')
	: () => null

declare var RTCPeerConnection: any;
declare var RTCIceCandidate: any;
declare var RTCSessionDescription: any;
declare var navigator: any;

declare var kurentoClient: any;
declare var webRtcPeer: any;

type StateT = {
  local: Object,
  remote: Array<any>
};

class ActivityRunner extends Component<ActivityRunnerT, StateT> {

  createWebSocketConnection = () => {
    this.ws = new WebSocket(signalServerURL);

    var self = this;

    //when web socket connection is oppened, register on signal server
    this.ws.onopen = function (event) {
      self.register(this.name, this.id, this.roomId);
    }

    this.ws.onmessage = function(message) {
      const parsedMessage = JSON.parse(message.data);
      if(parsedMessage.id !== "iceCandidate") {
        console.info('Received message: ' + message.data);
      }

    
      switch (parsedMessage.id) {
      case 'existingParticipants':
        console.log("==>existingParticipants");
        console.log(parsedMessage);
        self.onExistingParticipants(parsedMessage);
        break;
      case 'newParticipantArrived':
        console.log("==>newParticipantArrived");
        self.onNewParticipant(parsedMessage.name, parsedMessage.userId);
        break;
      case 'participantLeft':
        console.log("==>participantLeft");
        self.onParticipantLeft(parsedMessage.userId);
        break;
      case 'receiveVideoAnswer':
        console.log("==>receiveVideoAnswer");
        self.receiveVideoResponse(parsedMessage.userId, parsedMessage.sdpAnswer);
        break;
      case 'iceCandidate':
        //console.log("==>iceCandidate");
        self.participants[parsedMessage.userId].onRemoteCandidate(parsedMessage.candidate);
        break;
      default:
        console.error('Unrecognized message', parsedMessage);
      }
    }
  };

  sendMessage = message => {
    const jsonMessage = JSON.stringify(message);
    // console.log('Senging message: ' + jsonMessage);
    this.ws.send(jsonMessage);
  };

  register = (name, id, roomId) => {
	  const message = {
		  id : 'joinRoom',
      name : this.name,
      userId: this.id,
		  room : this.roomId,
	  }
	  this.sendMessage(message);
  };

  onExistingParticipants = msg => {
    var userMediaConstraints = {
      audio : true,
      video : true 
      // {
      //   mandatory : {
      //     maxWidth : 320,
      //     maxFrameRate : 15,
      //     minFrameRate : 15
      //   }
      // }
    };

    const self = this;


    //this functions will be given to Participant object
    //when stream is created, this function will be called
    function onAddLocalStream(stream){

      var captions = stream.addTextTrack('captions', 'live captions', 'en-US');
      // as caption cues come in, add them to the track for display
      stream.addCue(new TextTrackCue('1', 12.783, 14.612, 'Mum, give me the butter.'));
      stream.addCue(new TextTrackCue('2', 14.612, 16.091, 'I am waiting for the magic word!'));

      onStreamAdded(stream);

      self.setState(
        {
          local: {
            name: self.name,
            id: self.id
          }
        }
      );

      //setting stream to my video (myVideo is rendered after updating state)
      var myVideo = document.getElementById(self.id);
      myVideo.srcObject = stream;
    }

    var options = {
      onAddLocalStream: onAddLocalStream,
      configuration: rtcConfiguration,
      userMediaConstraints: userMediaConstraints
    }

    //create new participant for send only my stream
    var participant = new Participant(this.name, this.id, this.sendMessage);
    this.participants[participant.id] = participant;
    participant.createSendOnlyPeer(options);

    //for each of the existing participants, receive their video feed
    msg.data.forEach(this.receiveVideo);
  };

  onNewParticipant = (name, userId) => {
    this.receiveVideo({name: name, id: userId});
  };

  //receive video from remote peer
  receiveVideo = newParticipant => {
    const self = this;

    var participant = new Participant(newParticipant.name, newParticipant.id, this.sendMessage);
    this.participants[participant.id] = participant;
    
    function onAddRemoteStream(event){
      var stream = event.stream;

      self.addRemoteUserToState(newParticipant);
      var newParticipantVideo = document.getElementById(newParticipant.id);
      newParticipantVideo.srcObject = stream;
    }

    var options = {
      onaddstream: onAddRemoteStream,
      configuration: rtcConfiguration
    }

    participant.createRecvOnlyPeer(options);
  }

  addRemoteUserToState = (participant) => {
    var remotes = this.state.remote;
    //remotes.push({remoteUser: {name: participant.name, id: participant.id}});
    remotes.push({name: participant.name, id: participant.id});
    this.setState({
      remote: remotes
    });
  };

  removeRemoteUserFromState = (participantId) => {
    var remotes = this.state.remote;
    remotes = remotes.filter(r => r.id !== participantId);
    console.log("Remotes after removing user");
    console.log(remotes);
    this.setState({
      remote: remotes
    });
  };


  //receive answer from remote peer
  receiveVideoResponse = (id, sdpAnswer) => {
    this.participants[id].processAnswer(sdpAnswer);
  }

  //remove participant from remotes and update state
  onParticipantLeft = participantId => {
    console.log('Participant ', participantId, ' left');
    var participant = this.participants[participantId];
  
    //remove and update state
    this.removeRemoteUserFromState(participantId);
  
    participant.dispose();
    delete this.participants[participantId];
  }

  leaveRoom = () => {
    this.sendMessage({
      id : 'leaveRoom'
    });
  
    for ( var key in this.participants) {
      this.participants[key].dispose();
    }
    
    this.ws.close();
  }

  constructor(props: ActivityRunnerT) {
    super(props);
    this.name = "";
    this.id = "";
    this.roomId = "";
    this.ws = null;
    this.participants = {};
    this.state = { local: {}, remote: [] };
  }

  componentDidMount() {
    //set up variables
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;
    this.roomId = this.props.sessionId + this.props.groupingValue;

    this.createWebSocketConnection();
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  render() {
    const local = this.state.local;
    const remote = this.state.remote;
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
