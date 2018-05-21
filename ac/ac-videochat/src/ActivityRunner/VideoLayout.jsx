// @flow

import * as React from 'react';
import { isEmpty } from 'lodash';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Refresh from '@material-ui/icons/Refresh';
import Screen from '@material-ui/icons/ScreenShare';
import ScreenOff from '@material-ui/icons/StopScreenShare';
import Video from './Video';

const styles = {
  videoBoxS: {
    maxWidth: '400px',
    minWidth: '200px',
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
  reloadStream: Function,
  toogleScreenShare: Function,
  toogleScreenSupported: boolean
};

type StateT = {
  video: boolean,
  audio: boolean,
  screen: boolean
};

class VideoLayout extends React.Component<VideoLayoutPropsT, StateT> {
  constructor(props: VideoLayoutPropsT) {
    super(props);
    this.state = {
      video: true,
      audio: true,
      screen: false
    };
  }

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

  handleScreenShareToogle = () => {
    const screenValue = !this.state.screen;
    this.setState({ screen: screenValue });
    this.props.toogleScreenShare();
  };

  render() {
    const { local, remote, reloadStream, toogleScreenSupported } = this.props;
    const sortedRemote = remote.sort((a, b) => (a.name > b.name ? 1 : 0));
    return (
      <React.Fragment>
        <div style={styles.layoutBoxS}>
          {local &&
            !isEmpty(local) && (
              <div style={styles.videoBoxS}>
                <Video videoId={local.id} mute srcObject={local.srcObject} />
                <button
                  style={styles.buttonBoxS}
                  onClick={() => this.handleVideoToggle()}
                >
                  {this.state.video && <Videocam />}
                  {!this.state.video && <VideocamOff />}
                </button>
                <button
                  style={styles.buttonBoxS}
                  onClick={() => this.handleAudioToggle()}
                >
                  {this.state.audio && <Mic />}
                  {!this.state.audio && <MicOff />}
                </button>
                {toogleScreenSupported && (
                  <button
                    style={styles.buttonBoxS}
                    onClick={() => this.handleScreenShareToogle()}
                  >
                    {this.state.screen && <Screen />}
                    {!this.state.screen && <ScreenOff />}
                  </button>
                )}
                {local.name && (
                  <p>
                    <i>Local: {local.name}</i>
                  </p>
                )}
              </div>
            )}
          {sortedRemote.map((participant, _) => (
            <div style={styles.videoBoxS} key={participant.id}>
              <Video
                videoId={participant.id}
                mute={false}
                srcObject={participant.srcObject}
              />
              <button
                style={styles.buttonBoxS}
                onClick={() => reloadStream(participant.id)}
              >
                <Refresh />
              </button>
              <p>{participant.name}</p>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default VideoLayout;
