// @flow

import React, { Component } from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';
import 'webrtc-adapter';

import WebRtcConfig from '../webrtc-config/config';
import BrowserUtils from '../utils/browser';
import { onStreamAdded } from '../analytics/AVStreamAnalysis';

import Header from './Header';
import VideoLayout from './VideoLayout';

import Participant from './participant';

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
  name: string;
  id: string;
  roomId: string;
  participants: Object;
  ws: WebSocket;
  stream: MediaStream;
  browser: {
    browser: string,
    version: number
  };

  constructor(props: ActivityRunnerPropsT) {
    super(props);
    this.participants = {};
    this.state = { local: {}, remote: [] };
  }

  componentDidMount() {
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;
    this.browser = BrowserUtils.detectBrowser();

    // TODO, change in the future with activity ID + instanceId
    this.roomId = this.props.sessionId + this.props.groupingValue;

    this.createWebSocketConnection();
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  createWebSocketConnection = () => {
    this.ws = new WebSocket(WebRtcConfig.signalServerURL);

    this.ws.onopen = _ => {
      // when web socket connection is oppened, register on signal server
      this.requestMediaDevices();
    };

    this.ws.onmessage = (message: any) => {
      const parsedMessage = JSON.parse(message.data);

      switch (parsedMessage.id) {
        case 'existingParticipants':
          this.onExistingParticipants(parsedMessage);
          break;
        case 'newParticipantArrived':
          this.onNewParticipant(parsedMessage.name, parsedMessage.userId);
          break;
        case 'participantLeft':
          this.onParticipantLeft(parsedMessage.userId);
          break;
        case 'receiveVideoAnswer':
          this.receiveVideoResponse(
            parsedMessage.userId,
            parsedMessage.sdpAnswer
          );
          break;
        case 'iceCandidate':
          this.participants[parsedMessage.userId].onRemoteCandidate(
            parsedMessage.candidate
          );
          break;
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    };
  };

  sendMessage = (message: Object) => {
    this.ws.send(JSON.stringify(message));
  };

  requestMediaDevices = () => {
    if (navigator.mediaDevices)
      navigator.mediaDevices
        .getUserMedia(WebRtcConfig.mediaConstraints)
        .then(myStream => {
          this.stream = myStream;
          this.register(this.name, this.id, this.roomId, 'none');
        })
        .catch(error => {
          console.info(
            'User blocked media devices, there are no devices or are already in use',
            error
          );
          this.register(this.name, this.id, this.roomId, 'watcher');
        });
  };

  register = (name, id, roomId, role) => {
    const message = {
      id: 'joinRoom',
      name: this.name,
      userId: this.id,
      room: this.roomId,
      role
    };
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

      // from AVStreamAnalysis
      onStreamAdded(this.stream, analysisOptions);

      this.setState({
        local: {
          name: this.name,
          id: this.id,
          srcObject: this.stream
        }
      });

      const options = {
        configuration: WebRtcConfig.rtcConfiguration,
        myStream: this.stream,
        offerConstraints: WebRtcConfig.sendOnlyOfferConstraintChrome
      };

      if (this.browser.browser === 'firefox') {
        options.offerConstraints = WebRtcConfig.sendOnlyOfferConstraintFirefox;
      }

      // create new participant for send only my stream
      const participant = new Participant(this.name, this.id, this.sendMessage);
      this.participants[participant.id] = participant;
      participant.createSendOnlyPeer(options);
    }

    // for each of the existing participants, receive their video feed
    msg.data.forEach(this.receiveVideo);
  };

  onNewParticipant = (name, userId) => {
    this.receiveVideo({ name, id: userId });
  };

  // receive video from remote peer
  receiveVideo = (newParticipant: { name: string, id: string }) => {
    const participant = new Participant(
      newParticipant.name,
      newParticipant.id,
      this.sendMessage
    );

    this.participants[participant.id] = participant;

    const onAddRemoteTrack = event => {
      const stream = event.streams[0];
      this.addRemoteUserToState(newParticipant, stream);
    };

    const options = {
      ontrack: onAddRemoteTrack,
      configuration: WebRtcConfig.rtcConfiguration,
      offerConstraints: WebRtcConfig.recvOnlyOfferConstraintChrome
    };

    if (this.browser.browser === 'firefox') {
      options.offerConstraints = WebRtcConfig.recvOnlyOfferConstraintFirefox;
    }

    participant.createRecvOnlyPeer(options);
  };

  addRemoteUserToState = (participant: Participant, stream: MediaStream) => {
    const remotes = this.state.remote;
    const userInRemotes =
      remotes.filter(r => r.name === participant.name).length > 0;
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

  removeRemoteUserFromState = (participantId: string) => {
    let remotes = this.state.remote;
    remotes = remotes.filter(r => r.id !== participantId);
    this.setState({
      remote: remotes
    });
  };

  // receive answer from remote peer
  receiveVideoResponse = (id: string, sdpAnswer: string) => {
    this.participants[id].processAnswer(sdpAnswer);
  };

  // remove participant from remotes and update state
  onParticipantLeft = (participantId: string) => {
    const participant = this.participants[participantId];

    // remove and update state
    this.removeRemoteUserFromState(participantId);

    participant.dispose();
    delete this.participants[participantId];
  };

  leaveRoom = () => {
    this.sendMessage({
      id: 'leaveRoom'
    });

    Object.values(this.participants).forEach((p: Participant) => p.dispose());
    this.ws.close();
  };

  // toogles audio from being sent to media server
  toogleAudio = () => {
    const thisParticipant = this.participants[this.id];
    thisParticipant.toogleAudio();
  };

  // toogles video from being sent to media server
  toogleVideo = () => {
    const thisParticipant = this.participants[this.id];
    thisParticipant.toogleVideo();
  };

  reloadStream = (participantId: string) => {
    this.removeRemoteUserFromState(participantId);
    const participant = this.participants[participantId];
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

export default (props: ActivityRunnerPropsT) => <ActivityRunner {...props} />;
