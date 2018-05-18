// @flow

/* eslint-disable no-alert */
import React, { Component } from 'react';
import { type ActivityRunnerPropsT, values } from 'frog-utils';

import WebRtcConfig from '../webrtc-config/config';
import BrowserUtils from '../utils/browser';
import { onStreamAdded } from '../analytics/AVStreamAnalysis';

import Header from './Header';
import VideoLayout from './VideoLayout';

import Participant from './participant';

declare var RTCIceCandidate: any;
declare var RTCPeerConnection: any;
declare var RTCSessionDescription: any;

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
type OptionsT = { myStream?: *, ontrack?: *, configuration: * };

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
  activityType: string;
  role: string;

  constructor(props: ActivityRunnerPropsT) {
    super(props);
    this.participants = {};
    this.state = { local: {}, remote: [] };
  }

  componentDidMount() {
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;
    this.browser = BrowserUtils.detectBrowser();
    this.activityType = this.props.activityData.config.activityType;
    if (!this.props.activityData.config.userMediaConstraints.audio) {
      WebRtcConfig.mediaConstraints.audio = false;
    }
    if (!this.props.activityData.config.userMediaConstraints.video) {
      WebRtcConfig.mediaConstraints.video = false;
    }

    // TODO, change in the future with activity ID + instanceId
    this.roomId = this.props.sessionId + this.props.groupingValue;

    if (this.activityType === 'many2many') {
      this.role = 'none';
    } else if (this.activityType === 'one2many') {
      if (this.name === 'teacher') {
        this.role = 'teacher';
      } else {
        this.role = 'watcher';
      }
    }

    this.createWebSocketConnection();
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  createWebSocketConnection = () => {
    this.ws = new WebSocket(WebRtcConfig.signalServerURL);

    this.ws.onerror = error => {
      alert(
        "If you have AdBlock, it might be blocking connections, please put FROG on AdBlock's whitelist"
      );
      console.error(error);
    };

    this.ws.onopen = _ => {
      // when web socket connection is oppened, register on signal server
      if (this.role === 'watcher') {
        if (this.browser.browser === 'safari') {
          // safari has a bug where you cannot receive streams if you don't allow media devices
          // this code should be updated once safari fixes that problem
          this.requestMediaDevices(this.role);
        } else {
          this.register(this.name, this.id, this.roomId, 'watcher');
        }
      } else {
        this.requestMediaDevices(this.role);
      }
    };

    this.ws.onmessage = (message: any) => {
      const parsedMessage = JSON.parse(message.data);

      switch (parsedMessage.id) {
        case 'existingParticipants':
          this.onExistingParticipants(parsedMessage);
          break;
        case 'newParticipantArrived':
          this.onNewParticipant(
            parsedMessage.name,
            parsedMessage.userId,
            parsedMessage.role
          );
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

  requestMediaDevices = (role: string) => {
    if (navigator.mediaDevices)
      navigator.mediaDevices
        .getUserMedia(WebRtcConfig.mediaConstraints)
        .then(myStream => {
          this.stream = myStream;
          this.register(this.name, this.id, this.roomId, role);
        })
        .catch(error => {
          console.error('Error happened when requesting user media, ', error);
          switch (error.name) {
            case 'NotAllowedError':
              if (role === 'teacher') {
                alert(
                  'Your students cannot see/hear you if you do not allow camera/microphone. ' +
                    'Press F5 to refresh the page and allow camera/microphone'
                );
              } else {
                if (this.browser.browser !== 'safari') {
                  alert(
                    'Safari has an issue where you cannot see and hear other users unless ' +
                      'you allow application to use camera/microphone. '
                  );
                }
                this.register(this.name, this.id, this.roomId, 'watcher');
              }
              break;

            case 'NotReadableError':
              alert(
                'Your camera and microphone are already being used by another application.'
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
              break;

            case 'NotFoundError':
              alert('Camera and microphon not found on your computer');
              this.register(this.name, this.id, this.roomId, 'watcher');
              break;

            case 'OverconstrainedError':
              alert(
                'Your camera/microphone do not meet the constraints requested by this application.'
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
              console.error(error);
              break;

            case 'TypeError':
              alert(
                'Application requested your camera/mic with illegal constraints'
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
              break;

            case 'SecurityError':
              alert(
                'User media support is disabled on the Document which requested your camera/mic.'
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
              console.error(error);
              break;

            case 'AbortError':
              alert(
                'Unknown error appeared that prevents usage of your camera/microphone'
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
              console.error(error);
              break;

            default:
              console.error(
                'Error happened when requesting user media, ',
                error
              );
          }
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
    // we chach if role is watcher because of bug in safari
    // that condition should be removed once safari fixes recvonly connections
    if (this.stream && this.role !== 'watcher') {
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

      this.createPeer('sendonly', this.name, this.id, this.role);
    }

    // for each of the existing participants, receive their video feed
    msg.data.forEach(this.receiveVideo);
  };

  createPeer = (mode, name, id, role) => {
    const peerMode = {
      mode
    };
    const participant = new Participant(name, id, role, this.sendMessage);
    this.participants[participant.id] = participant;

    if (role !== 'watcher') {
      const onAddRemoteTrack = event => {
        const stream = event.streams[0];
        this.addRemoteUserToState(participant, stream);
      };

      const options: OptionsT = {
        configuration: WebRtcConfig.rtcConfiguration
      };

      if (mode === 'sendonly') {
        options.myStream = this.stream;
        if (this.browser.browser !== 'chrome') {
          peerMode.mode = 'sendrecv';
        }
      } else if (mode === 'recvonly') {
        options.ontrack = onAddRemoteTrack;
      }

      participant.createPeer(peerMode.mode, options);
    }
  };

  onNewParticipant = (name, userId, role) => {
    this.receiveVideo({ name, id: userId, role });
  };

  // receive video from remote peer
  receiveVideo = (newParticipant: {
    name: string,
    id: string,
    role: string
  }) => {
    this.createPeer(
      'recvonly',
      newParticipant.name,
      newParticipant.id,
      newParticipant.role
    );
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

    values(this.participants).forEach((p: Participant) => p.dispose());
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
