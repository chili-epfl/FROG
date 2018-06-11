// @flow

/* eslint-disable no-alert */
import React, { Component } from 'react';
import { type ActivityRunnerPropsT, values } from 'frog-utils';
import * as AdapterJs from 'webrtc-adapter';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import WebRtcConfig from '../webrtc-config/config';
import { onStreamAdded, onVAD } from '../analytics/AVStreamAnalysis';

import Header from './Header';
import VideoLayout from './VideoLayout';
import ParticipantsView from './ParticipantsView';

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
  remote: Array<any>,
  participants: Array<any>
};
type OptionsT = { myStream?: *, ontrack?: *, configuration: * };

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

class ActivityRunner extends Component<ActivityRunnerPropsT, StateT> {
  name: string;
  id: string;
  role: string;
  roomId: string;
  participants: Object;
  ws: WebSocket;
  stream: MediaStream;
  browser: {
    browser: string,
    version: number
  };
  activityType: string;
  mediaConstraints: Object;
  screenSharingOn: boolean;
  sendOnlyParticipant: Object;
  record: boolean;
  useAnalysis: boolean;

  constructor(props: ActivityRunnerPropsT) {
    super(props);
    this.participants = {};
    this.state = { local: {}, remote: [], participants: [] };
    this.mediaConstraints = WebRtcConfig.mediaConstraints;
    this.browser = AdapterJs.browserDetails;
  }

  componentDidMount() {
    this.name = this.props.userInfo.name;
    this.id = this.props.userInfo.id;
    this.activityType = this.props.activityData.config.activityType;
    this.record = this.props.activityData.config.recordChat;
    this.useAnalysis = this.props.activityData.config.useAnalysis;
    this.mediaConstraints.audio = !!this.props.activityData.config
      .userMediaConstraints.audio;
    if (!this.props.activityData.config.userMediaConstraints.video) {
      this.mediaConstraints.video = false;
    } else {
      const res = this.props.activityData.config.userMediaConstraints
        .videoResolution;

      const width = res.split('x')[0];
      const height = res.split('x')[1];

      const frameRate = this.props.activityData.config.userMediaConstraints
        .frameRate;

      this.mediaConstraints.video = {
        width,
        height,
        frameRate
      };
    }

    this.roomId =
      this.props.activityId + this.props.sessionId + this.props.groupingValue;

    if (this.activityType === 'group') {
      this.role = 'none';
    } else if (this.activityType === 'webinar') {
      if (this.isTeacher(this.name)) {
        this.role = 'teacher';
      } else {
        this.role = 'watcher';
      }
    }

    this.createWebSocketConnection();
  }

  componentWillUnmount() {
    this.leaveRoom();
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }

  createWebSocketConnection = () => {
    this.ws = new WebSocket(WebRtcConfig.signalServerURL);

    this.ws.onerror = error => {
      alert(
        "Cannot connect to server. If you have AdBlock, it might be blocking connections, please put FROG on AdBlock's whitelist"
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
          this.register(this.name, this.id, this.roomId, this.role);
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
          this.onNewParticipant({
            name: parsedMessage.name,
            id: parsedMessage.userId,
            role: parsedMessage.role
          });
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
        case 'changeRole':
          this.onRoleChanged(parsedMessage.userId, parsedMessage.newRole);
          break;

        case 'alert':
          if (parsedMessage.alertId === 'otherLogin') {
            const state = { local: {}, remote: [], participants: [] };
            this.setState(state);
          }
          alert(parsedMessage.message);
          break;

        case 'raisedHand': {
          const participants = this.state.participants;
          participants.filter(
            p => p.id === parsedMessage.userId
          )[0].raisedHand =
            parsedMessage.raised;
          this.setState({ participants });
          break;
        }
        default:
          console.error('Unrecognized message', parsedMessage);
      }
    };
  };

  sendMessage = (message: Object) => {
    if (this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('Trying to send message on unopened websocket');
    }
  };

  requestMediaDevices = (role: string) => {
    if (navigator.mediaDevices)
      navigator.mediaDevices
        .getUserMedia(this.mediaConstraints)
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
              console.error('Error happened: ' + error.name);
              console.error(
                'Error happened when requesting user media, ',
                error
              );
              this.register(this.name, this.id, this.roomId, 'watcher');
          }
        });
  };

  register = (name, id, roomId, role) => {
    const message = {
      id: 'joinRoom',
      name: this.name,
      userId: this.id,
      room: this.roomId,
      record: this.record,
      role
    };
    this.sendMessage(message);
  };

  onExistingParticipants = msg => {
    const participant = new Participant(
      this.name,
      this.id,
      this.role,
      this.sendMessage
    );
    this.sendOnlyParticipant = participant;
    this.participants[participant.id] = participant;

    const participants = this.state.participants;
    participants.push({
      name: this.name,
      id: this.id,
      raisedHand: false,
      speaking: false,
      streaming: false
    });
    this.setState({ participants });

    // we check if role is watcher because of bug in safari
    // in normal situation, if there is no stream, there is no send only peer
    // but for safari, there is stream, but role is watcher, because stream must be
    // acquired in order to have recvonly connections in safari
    // that condition should be removed once safari fixes recvonly connections
    if (this.stream && this.role !== 'watcher') {
      if (this.useAnalysis) {
        this.startAnalysis();
      }
      this.setLocalState();
      if (this.useAnalysis) {
        onVAD(this.stream, isSpeaking => {
          this.setParticipantSpeaking(this.id, isSpeaking);
        });
      }
      if (this.browser.browser !== 'chrome') {
        this.createPeer('sendrecv', participant);
      } else {
        this.createPeer('sendonly', participant);
      }
    }

    // for each of the existing participants, receive their video feed
    msg.data.forEach(this.onNewParticipant);
  };

  startAnalysis = () => {
    const analysisOptions = {
      local: true,
      name: this.name,
      id: this.id,
      logger: this.props.logger
    };

    // from AVStreamAnalysis
    onStreamAdded(this.stream, analysisOptions);
  };

  setLocalState = () => {
    this.setState({
      local: {
        name: this.name,
        id: this.id,
        srcObject: this.stream
      }
    });
  };

  // receive video from remote peer
  onNewParticipant = (newParticipant: {
    name: string,
    id: string,
    role: string
  }) => {
    const participant = new Participant(
      newParticipant.name,
      newParticipant.id,
      newParticipant.role,
      this.sendMessage
    );
    this.participants[participant.id] = participant;
    const participants = this.state.participants;
    participants.push({
      name: participant.name,
      id: participant.id,
      raisedHand: false,
      speaking: false,
      streaming: false
    });
    this.setState({ participants });

    if (newParticipant.role !== 'watcher') {
      this.createPeer('recvonly', participant);
    }
  };

  createPeer = (mode: string, participant: Participant) => {
    const options: OptionsT = {
      configuration: WebRtcConfig.rtcConfiguration
    };

    if (mode === 'sendonly' || mode === 'sendrecv') {
      options.myStream = this.stream;
      this.setParticipantStreaming(participant.id, true);
    } else if (mode === 'recvonly') {
      const onAddRemoteTrack = event => {
        const stream = event.streams[0];
        this.addRemoteUserToState(participant, stream);
        if (this.useAnalysis) {
          onVAD(event.streams[0], isSpeaking => {
            this.setParticipantSpeaking(participant.id, isSpeaking);
          });
        }
        this.setParticipantStreaming(participant.id, true);
      };
      options.ontrack = onAddRemoteTrack;
    }

    participant.createPeer(mode, options);
  };

  setParticipantSpeaking = (participantId, isSpeaking) => {
    if (this.state.participants.filter(p => p.id === participantId)[0]) {
      const participants = this.state.participants;
      participants.filter(p => p.id === participantId)[0].speaking = isSpeaking;
      this.setState({ participants });
    }
  };

  setParticipantStreaming = (participantId, isStreaming) => {
    if (this.state.participants.filter(p => p.id === participantId)[0]) {
      const participants = this.state.participants;
      participants.filter(
        p => p.id === participantId
      )[0].streaming = isStreaming;
      this.setState({ participants });
    }
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
    const remote = this.state.remote.filter(r => r.id !== participantId);
    this.setState({
      remote
    });
  };

  removeParticipantFromState = (participantId: string) => {
    const participants = this.state.participants.filter(
      p => p.id !== participantId
    );
    this.setState({
      participants
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
    this.removeParticipantFromState(participantId);

    if (participant) {
      participant.dispose();
    }

    delete this.participants[participantId];
  };

  leaveRoom = () => {
    this.sendMessage({
      id: 'leaveRoom'
    });

    values(this.participants).forEach((p: Participant) => p.dispose());
    if (this.ws.readyState === 1) {
      this.ws.close();
    }
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

  toogleScreenShare = screenType => {
    if (this.browser.browser === 'firefox') {
      if (this.screenSharingOn) {
        this.sendOnlyParticipant.stopScreenShare();
        this.screenSharingOn = false;
      } else {
        if (navigator.mediaDevices) {
          navigator.mediaDevices
            .getUserMedia({
              video: {
                mediaSource: screenType
              }
            })
            .then(screenStream => {
              this.sendOnlyParticipant.startScreenShare(screenStream);
            })
            .catch(err => {
              console.error('Could not get stream: ', err);
            });
        }
        this.screenSharingOn = true;
      }
    }
  };

  onRoleChanged = (userId: string, newRole: string) => {
    if (this.id === userId && this.role !== newRole) {
      if (newRole === 'presenter') {
        if (navigator.mediaDevices) {
          navigator.mediaDevices
            .getUserMedia(this.mediaConstraints)
            .then(stream => {
              this.stream = stream;

              this.startAnalysis();

              this.setState({
                local: {
                  name: this.name,
                  id: this.id,
                  srcObject: this.stream
                }
              });

              const options = {
                myStream: stream,
                configuration: WebRtcConfig.rtcConfiguration
              };
              this.sendOnlyParticipant.role = newRole;
              this.sendOnlyParticipant.createPeer('sendonly', options);
              this.setParticipantStreaming(this.sendOnlyParticipant.id, true);
            })
            .catch(error => {
              console.error(error);
            });
        }
      } else if (newRole === 'watcher') {
        this.setParticipantStreaming(this.sendOnlyParticipant.id, false);
        this.sendOnlyParticipant.dispose();
        this.setState({ local: {} });
      }
      this.role = newRole;
      this.sendOnlyParticipant.role = newRole;
    } else {
      const participant = this.participants[userId];
      if (participant.role !== newRole) {
        if (newRole === 'watcher') {
          // remove stream from that user
          this.removeRemoteUserFromState(participant.id);
          this.setParticipantStreaming(participant.id, false);
        } else {
          this.createPeer('recvonly', participant);
        }
        participant.role = newRole;
      }
    }
  };

  giveMic = (participantId: string) => {
    this.sendMessage({
      id: 'changeRole',
      userId: participantId,
      newRole: 'presenter'
    });
    this.sendMessage({
      id: 'notifyParticipants',
      payload: {
        id: 'raisedHand',
        userId: participantId,
        raised: false
      }
    });
    // update state for yourself
    const participants = this.state.participants;
    participants.filter(p => p.id === participantId)[0].raisedHand = false;
    this.setState({ participants });
  };

  removeLocalStream = () => {
    this.sendMessage({
      id: 'changeRole',
      userId: this.id,
      newRole: 'watcher'
    });
  };

  removePresenterStream = (presenterId: string) => {
    this.sendMessage({
      id: 'changeRole',
      userId: presenterId,
      newRole: 'watcher'
    });
  };

  raiseHand = (e: boolean) => {
    const message = {
      id: 'notifyParticipants',
      payload: {
        id: 'raisedHand',
        userId: this.id,
        raised: e
      }
    };
    this.sendMessage(message);
    const participants = this.state.participants;
    participants.filter(p => p.id === this.id)[0].raisedHand = true;
    this.setState({ participants });
  };

  isTeacher = (name: string) => {
    if (name === 'teacher') {
      return true;
    }
    const teacherNames = this.props.activityData.config?.teacherNames;
    if (teacherNames) {
      return teacherNames
        .split(',')
        .map(x => x.trim())
        .includes(name);
    }
    return false;
  };

  render() {
    const local = this.state.local;
    const remote = this.state.remote;
    const participants = this.state.participants;
    const removeLocalStream =
      this.activityType === 'group' || this.isTeacher(this.name)
        ? undefined
        : this.removeLocalStream;
    const removePresenterStream =
      this.activityType === 'webinar' && this.isTeacher(this.name)
        ? this.removePresenterStream
        : undefined;
    const raiseHand =
      this.activityType === 'webinar' && !this.isTeacher(this.name)
        ? this.raiseHand
        : undefined;
    const giveMic =
      this.activityType === 'webinar' && this.isTeacher(this.name)
        ? this.giveMic
        : undefined;
    return (
      <div id="webrtc" style={{ height: 'auto', overflow: 'hidden' }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Header {...this.props} />
          </Grid>
          <Grid item xs={3}>
            <ParticipantsView
              participants={participants.map(
                x => (this.isTeacher(x.name) ? { ...x, isTeacher: true } : x)
              )}
              isTeacher={this.isTeacher}
              giveMic={giveMic}
              raiseHand={raiseHand}
              myId={this.id}
            />
          </Grid>
          <Grid item xs={9}>
            <VideoLayout
              activityData={this.props.activityData}
              isTeacher={this.isTeacher}
              local={local}
              remote={remote}
              toogleAudio={this.toogleAudio}
              toogleVideo={this.toogleVideo}
              reloadStream={this.reloadStream}
              toogleScreenShare={this.toogleScreenShare}
              toogleScreenSupported={this.browser.browser === 'firefox'}
              removeLocalStream={removeLocalStream}
              removePresenterStream={removePresenterStream}
              muteParticipantsByDefault={
                this.props.activityData.config.muteParticipantsByDefault
              }
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';

export default withStyles(styles)(ActivityRunner);
