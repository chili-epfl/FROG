// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import 'webrtc-adapter';

import { isUndefined, isEqual, without, difference, last } from 'lodash';
import WebRtcConfig from '../webrtc-config/config';
import BrowserUtils from '../utils/browser';
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
	? require('../lib/hark.bundle.js')
	: () => null

/**
 * State consists of local and remote
 * local = {
 *   id: "this user's id",
 *   name: "this user's name"
 * }
 * 
 * remote has same structure as local (id and name fields)
 * for each remote participant, object is added to remote array
 * 
 * After state is updated and render is called, 
 *   video element is fetched and received video stream is set 
 *   to that video element
 */
type StateT = {
  local: Object,
  remote: Array<any>
};

class ActivityRunner extends Component<ActivityRunnerT, StateT> {



  createWebSocketConnection = () => {
    this.ws = new WebSocket(WebRtcConfig.signalServerURL);
    console.log(this.isFirefox);
    console.log(this.isChrome);


    var self = this;

    //when web socket connection is oppened, register on signal server
    this.ws.onopen = function (event) {

      self.sendMessage({id: "info", 
        name: self.name,
        browser: self.browser
      });

      self.register(this.name, this.id, this.roomId);
    }

    this.ws.onmessage = function(message) {
      const parsedMessage = JSON.parse(message.data);
    
      switch (parsedMessage.id) {
      case 'existingParticipants':
        console.log("==>existingParticipants");
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

        //method below may throw exception
        self.participants[parsedMessage.userId].onRemoteCandidate(parsedMessage.candidate);
        break;
      default:
        console.error('Unrecognized message', parsedMessage);
      }
    }
  };

  sendMessage = message => {
    //TODO try catch?

    const jsonMessage = JSON.stringify(message);
    // console.log('Send message: ' + jsonMessage);
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
    const self = this;

    function onAddLocalStream(stream){
      console.log("onAddLocalStream");
      const options = {
        local: true,
        name: self.name,
        id: self.id,
        logger: self.props.logger
      };
      
      //from AVStreamAnalysis
      onStreamAdded(stream, options);

      self.setState({local: {
            name: self.name,
            id: self.id
      }});

      //setting stream to my video (myVideo is rendered after updating state)
      //TODO put small delay to wait for React's render and try to obtain video
      function setVideo(){
        setTimeout(() => { 
          var myVideo = document.getElementById(self.id);
          if(myVideo) {
            myVideo.srcObject = stream;
          } else {
            setVideo();
          }
        }, 50);
      }
      setVideo();
    }

    function onUserMediaError(error) {
      console.log("Media already in use, or blocked:", error);
    }

    var options = {
      onaddstream: onAddLocalStream,
      configuration: WebRtcConfig.rtcConfiguration,
      userMediaConstraints: WebRtcConfig.sendOnlyMediaConstraints,
      onUserMediaError: onUserMediaError
    };

    if(this.browser.browser == "chrome"){
      options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintsChrome;
    } else if(this.browser.browser == "firefox") {
      options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintFirefox;
    } else {
      options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintFirefox;
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

      function setVideo(){
        setTimeout(() => { 
          var newParticipantVideo = document.getElementById(newParticipant.id);
          if(newParticipantVideo) {
            newParticipantVideo.srcObject = stream;
          } else {
            setVideo();
          }
        }, 50);
      }
      setVideo();

    }

    var options = {
      onaddstream: onAddRemoteStream,
      configuration: WebRtcConfig.rtcConfiguration
    };

    if(this.browser.browser == "chrome"){
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintChrome;
    } else if(this.browser.browser == "firefox") {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintFirefox;
    } else {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintFirefox;
    }

    participant.createRecvOnlyPeer(options);
  };

  addRemoteUserToState = (participant) => {
    var remotes = this.state.remote;
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
  };

  //remove participant from remotes and update state
  onParticipantLeft = participantId => {
    console.log('Participant ', participantId, ' left');
    var participant = this.participants[participantId];
  
    //remove and update state
    this.removeRemoteUserFromState(participantId);
  
    participant.dispose();
    delete this.participants[participantId];
  };

  leaveRoom = () => {
    this.sendMessage({
      id : 'leaveRoom'
    });

    Object.values(this.participants).forEach(p => p.dispose());
    this.ws.close();
  };

  //toogles audio from being sent to media server
  toogleAudio = () => {
    var thisParticipant = this.participants[this.id];
    thisParticipant.toogleAudio();
  };

  //toogles video from being sent to media server
  toogleVideo = () => {
    var thisParticipant = this.participants[this.id];
    thisParticipant.toogleVideo();
  };

  reloadStream = (participantId) => {
    this.removeRemoteUserFromState(participantId);
    var participant = this.participants[participantId];
    participant.reloadStream();
  }

  constructor(props: ActivityRunnerT) {
    super(props);
    this.name = "";
    this.id = "";
    this.roomId = "";
    this.ws = null;
    this.participants = {};
    this.state = { local: {}, remote: [] };
    this.browser;
    this.videoSwitch = false;
    this.audioSwitch = false;
  }

  componentDidMount() {
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;

    //TODO, change in the future with activity ID
    this.roomId = this.props.sessionId + this.props.groupingValue;

    this.browser = BrowserUtils.detectBrowser();
    console.log(this.browser);

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
        <VideoLayout 
          local={local} 
          remote={remote} 
          toogleAudio={this.toogleAudio}
          toogleVideo={this.toogleVideo} 
          reloadStream={this.reloadStream}
        />
      </div>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';

export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
