// @flow

import React, { Component } from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';
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

export const Participant = isBrowser ? require('./participant.js') : () => null;

export const hark = isBrowser ? require('../lib/hark.bundle.js') : () => null;

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

class ActivityRunner extends Component<ActivityRunnerPropsT, StateT> {
  constructor(props: ActivityRunnerPropsT) {
    super(props);
    console.log(props);
    this.name = '';
    this.id = '';
    this.roomId = '';
    this.ws = null;
    this.participants = {};
    this.state = { local: {}, remote: [] };
    this.stream;
    this.browser;
  }

  componentDidMount() {
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;

    //TODO, change in the future with activity ID + instanceId
    this.roomId = this.props.sessionId + this.props.groupingValue;

    this.browser = BrowserUtils.detectBrowser();
    console.log(this.browser);

    this.createWebSocketConnection();
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  createWebSocketConnection = () => {
    this.ws = new WebSocket(WebRtcConfig.signalServerURL);

    var self = this;

    //when web socket connection is oppened, register on signal server
    this.ws.onopen = function(event) {
      self.requestMediaDevices();
    };

    this.ws.onmessage = function(message) {
      const parsedMessage = JSON.parse(message.data);

      switch (parsedMessage.id) {
        case 'existingParticipants':
          console.log('==>existingParticipants');
          self.onExistingParticipants(parsedMessage);
          break;
        case 'newParticipantArrived':
          console.log('==>newParticipantArrived');
          self.onNewParticipant(parsedMessage.name, parsedMessage.userId);
          break;
        case 'participantLeft':
          console.log('==>participantLeft');
          self.onParticipantLeft(parsedMessage.userId);
          break;
        case 'receiveVideoAnswer':
          console.log('==>receiveVideoAnswer');
          self.receiveVideoResponse(
            parsedMessage.userId,
            parsedMessage.sdpAnswer
          );
          break;
        case 'iceCandidate':
          //console.log("==>iceCandidate");

          //method below may throw exception
          self.participants[parsedMessage.userId].onRemoteCandidate(
            parsedMessage.candidate
          );
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    };
  };

  sendMessage = message => {
    this.ws.send(JSON.stringify(message));
  };

  requestMediaDevices = () => {
    navigator.mediaDevices
      .getUserMedia(WebRtcConfig.mediaConstraints)
      .then(myStream => {
        this.stream = myStream;
        this.register(this.name, this.id, this.roomId);
      })
      .catch(error => {
        console.log(
          'User blocked media devices, there are no devices or are already in use'
        );
        console.log('Registering user as watcher');
        this.register(this.name, this.id, this.roomId, 'watcher');
      });
  };

  register = (name, id, roomId, role) => {
    const message = {
      id: 'joinRoom',
      name: this.name,
      userId: this.id,
      room: this.roomId
    };
    if (role && role === 'watcher') {
      message.role = role;
    } else if (role && role === 'lecturer') {
      message.role = role;
    }
    this.sendMessage(message);
  };

  onExistingParticipants = msg => {
    if (this.stream) {
      const analysisOptions = {
        local: true,
        name: this.name,
        id: this.id,
        logger: this.props.logger
      };

      //from AVStreamAnalysis
      onStreamAdded(this.stream, analysisOptions);

      this.setState({
        local: {
          name: this.name,
          id: this.id,
          srcObject: this.stream
        }
      });

      var options = {
        configuration: WebRtcConfig.rtcConfiguration,
        userMediaConstraints: WebRtcConfig.mediaConstraints,
        myStream: this.stream
      };

      if (this.browser.browser == 'chrome') {
        options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintsChrome;
      } else if (this.browser.browser == 'firefox') {
        options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintFirefox;
      } else {
        options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintFirefox;
      }

      //create new participant for send only my stream
      var participant = new Participant(this.name, this.id, this.sendMessage);
      this.participants[participant.id] = participant;
      participant.createSendOnlyPeer(options);
    }

    //for each of the existing participants, receive their video feed
    msg.data.forEach(this.receiveVideo);
  };

  onNewParticipant = (name, userId) => {
    this.receiveVideo({ name: name, id: userId });
  };

  //receive video from remote peer
  receiveVideo = newParticipant => {
    const self = this;

    var participant = new Participant(
      newParticipant.name,
      newParticipant.id,
      this.sendMessage
    );
    this.participants[participant.id] = participant;

    function onAddRemoteStream(event) {
      //var stream = event.stream;
      var stream = event.streams[0];
      console.log(stream);
      self.addRemoteUserToState(newParticipant, stream);
      stream = true;
    }

    var options = {
      onaddstream: onAddRemoteStream,
      configuration: WebRtcConfig.rtcConfiguration
    };

    if (this.browser.browser == 'chrome') {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintChrome;
    } else if (this.browser.browser == 'firefox') {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintFirefox;
    } else {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintFirefox;
    }

    participant.createRecvOnlyPeer(options);
  };

  addRemoteUserToState = (participant, stream) => {
    var remotes = this.state.remote;
    var userInRemotes =
      remotes.filter(r => r.name == participant.name).length > 0;
    if (!userInRemotes) {
      remotes.push({
        name: participant.name,
        id: participant.id,
        srcObject: stream
      });
      this.setState({
        remote: remotes
      });
    }
  };

  removeRemoteUserFromState = participantId => {
    var remotes = this.state.remote;
    remotes = remotes.filter(r => r.id !== participantId);
    // console.log('Remotes after removing user');
    // console.log(remotes);
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
      id: 'leaveRoom'
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

  reloadStream = participantId => {
    this.removeRemoteUserFromState(participantId);
    var participant = this.participants[participantId];
    participant.reloadStream();
  };

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
