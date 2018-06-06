// @flow

import * as React from 'react';
import { isEmpty } from 'lodash';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Screen from '@material-ui/icons/ScreenShare';
import ScreenOff from '@material-ui/icons/StopScreenShare';
import FullScreen from '@material-ui/icons/Fullscreen';
import Cancel from '@material-ui/icons/Cancel';
import Video from './Video';

const styles = {
  videoBoxS: {
    width: '200px',
    flex: '0 1 auto',
    margin: 'auto',
    textAlign: 'center',
    fontSize: '1.20em'
  },
  layoutBoxS: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap'
  },
  buttonBoxS: {
    backgroundColor: '#3f51b5',
    border: 'none',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '50%'
  }
};

type VideoLayoutPropsT = {
  local: Object,
  remote: Array<any>,
  toogleAudio: Function,
  toogleVideo: Function,
  toogleScreenShare: Function,
  toogleScreenSupported: boolean,
  removeLocalStream?: Function,
  removePresenterStream?: Function,
  muteParticipantsByDefault: boolean,
  isTeacher: Function
};

type StateT = {
  video: boolean,
  audio: boolean,
  screen: boolean,
  mutedRemotes: any
};

class VideoLayout extends React.Component<VideoLayoutPropsT, StateT> {
  constructor(props: VideoLayoutPropsT) {
    super(props);
    const mutedRemotes = {};
    this.props.remote.forEach(r => {
      mutedRemotes[r.id] = this.props.muteParticipantsByDefault;
      if (this.props.muteParticipantsByDefault) {
        const audioTracks = r.srcObject.getAudioTracks()[0];
        if (audioTracks) {
          audioTracks.enabled = false;
        }
      }
    });
    this.state = {
      video: true,
      audio: true,
      screen: false,
      mutedRemotes
    };
  }

  componentWillReceiveProps = (nextProps: VideoLayoutPropsT) => {
    const mutedRemotes = this.state.mutedRemotes;
    nextProps.remote.forEach(r => {
      if (mutedRemotes[r.id] === undefined) {
        mutedRemotes[r.id] = this.props.muteParticipantsByDefault;
        if (this.props.muteParticipantsByDefault) {
          const audioTracks = r.srcObject.getAudioTracks()[0];
          if (audioTracks) {
            audioTracks.enabled = false;
          }
        }
      }
    });
    this.setState({ mutedRemotes });
  };

  handleVideoToggle = () => {
    if (!this.state.screen) {
      const videoValue = !this.state.video;
      this.setState({ video: videoValue });
      this.props.toogleVideo();
    }
  };

  handleAudioToggle = () => {
    const audioValue = !this.state.audio;
    this.setState({ audio: audioValue });
    this.props.toogleAudio();
  };

  handleScreenShareToogle = (screenType: string) => {
    const screenValue = !this.state.screen;
    this.setState({ screen: screenValue });
    this.props.toogleScreenShare(screenType);
  };

  toogleFullScreen = (videoId: string) => {
    const video: any = document.getElementById(videoId);
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  };

  removeLocalStream = () => {
    if (this.props.removeLocalStream) {
      this.props.removeLocalStream();
    }
  };

  removePresenterStream = (presenterId: string) => {
    if (this.props.removePresenterStream) {
      this.props.removePresenterStream(presenterId);
    }
  };

  toggleRemoteMic = (remoteId: string) => {
    const remote = this.props.remote.find(r => r.id === remoteId);
    if (remote) {
      const audioTracks = remote.srcObject.getAudioTracks()[0];
      if (audioTracks) {
        const mutedRemotes = this.state.mutedRemotes;
        if (mutedRemotes[remote.id]) {
          audioTracks.enabled = true;
          mutedRemotes[remote.id] = false;
        } else {
          audioTracks.enabled = false;
          mutedRemotes[remote.id] = true;
        }
        this.setState({ mutedRemotes });
      }
    }
  };

  render() {
    const {
      local,
      remote,
      toogleScreenSupported,
      removeLocalStream,
      removePresenterStream
    } = this.props;
    const sortedRemote = remote.sort((a, b) => (a.name > b.name ? 1 : 0));
    return (
      <div style={styles.layoutBoxS}>
        {sortedRemote.map((participant, _) => (
          <div style={styles.videoBoxS} key={participant.id}>
            <div style={{ position: 'relative' }} className="hoverable">
              <Video
                videoId={'remote_' + participant.id}
                mute={false}
                srcObject={participant.srcObject}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '0%',
                  right: '0%'
                }}
                className="show-on-hover"
              >
                <button
                  style={styles.buttonBoxS}
                  onClick={() => this.toggleRemoteMic(participant.id)}
                >
                  {!this.state.mutedRemotes[participant.id] && <Mic />}
                  {this.state.mutedRemotes[participant.id] && <MicOff />}
                </button>
                {removePresenterStream &&
                  !this.props.isTeacher(participant.name) && (
                    <button
                      style={styles.buttonBoxS}
                      onClick={() => this.removePresenterStream(participant.id)}
                    >
                      <Cancel />
                    </button>
                  )}
                <button
                  style={styles.buttonBoxS}
                  onClick={() =>
                    this.toogleFullScreen('remote_' + participant.id)
                  }
                >
                  <FullScreen />
                </button>
              </div>
              <p>{participant.name}</p>
            </div>
          </div>
        ))}
        {local &&
          !isEmpty(local) && (
            <div style={styles.videoBoxS}>
              <div style={{ position: 'relative' }} className="hoverable">
                <Video videoId={local.id} mute srcObject={local.srcObject} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '0%',
                    right: '0%'
                  }}
                  className="show-on-hover"
                >
                  {local.srcObject.getVideoTracks().length > 0 && (
                    <button
                      disabled={this.state.screen}
                      style={styles.buttonBoxS}
                      onClick={this.handleVideoToggle}
                    >
                      {this.state.video && <Videocam />}
                      {!this.state.video && <VideocamOff />}
                    </button>
                  )}
                  <button
                    style={styles.buttonBoxS}
                    onClick={this.handleAudioToggle}
                  >
                    {this.state.audio && <Mic />}
                    {!this.state.audio && <MicOff />}
                  </button>
                  {toogleScreenSupported &&
                    local.srcObject.getVideoTracks().length > 0 && (
                      <button
                        style={styles.buttonBoxS}
                        onClick={() => this.handleScreenShareToogle('screen')}
                      >
                        {this.state.screen && <Screen />}
                        {!this.state.screen && <ScreenOff />}
                      </button>
                    )}
                  {toogleScreenSupported &&
                    local.srcObject.getVideoTracks().length > 0 && (
                      <button
                        style={styles.buttonBoxS}
                        onClick={() => this.handleScreenShareToogle('window')}
                      >
                        {this.state.screen && <Screen />}
                        {!this.state.screen && <ScreenOff />}
                      </button>
                    )}
                  {removeLocalStream && (
                    <button
                      style={styles.buttonBoxS}
                      onClick={this.removeLocalStream}
                    >
                      <Cancel />
                    </button>
                  )}
                </div>
              </div>
              {local.name && (
                <p>
                  <i>You: {local.name}</i>
                </p>
              )}
            </div>
          )}
      </div>
    );
  }
}

export default VideoLayout;
