// @flow

import * as React from 'react';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Refresh from '@material-ui/icons/Refresh';
import Video from './Video';

type VideosPropsT = { 
  local: Object, 
  remote: Array<Object>, 
  toogleVideo: Function, 
  toogleAudio: Function,
  reloadStream: Function
};

const VideoBoxS = {
  maxWidth: '400px',
  minWidth: '200px',
  flex: '0 1 auto',
  margin: 'auto',
  textAlign: 'center',
  fontSize: '1.20em'
};

const LayoutBoxS = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap'
};

const ButtonBoxS = {
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
};


export default ({ local, remote, toogleVideo, toogleAudio, reloadStream }: VideosPropsT) => {
  const VideoList =
      <React.Fragment>
        <div style={VideoBoxS} key={local.id}>
          <Video videoId={local.id} self />
          <button style={ButtonBoxS} id={"btn_"+local.id} onClick={() => {
            toogleVideo();
            //change Videocam to VideocamOff
          }}>
            <Videocam/>
          </button>
          <button style={ButtonBoxS} onClick={() => {
            toogleAudio();
            //change Mic to MicOff
          }}>
            <Mic/>
          </button>
          {local.name && (
            <p>
              <i>Local: {local.name}</i>
            </p>
          )}
        </div>
        {remote.map((participant, index) => (
          <div style={VideoBoxS} key={participant.id}>
            <Video
              videoId={participant.id}
              index={'remotevideo' + index}
              name={participant.name}
            />
            <button style={ButtonBoxS} onClick={() => reloadStream(participant.id)}>
              <Refresh/>
            </button>
            <p>{participant.name}</p>
          </div>
        ))}
      </React.Fragment>

  return <div style={LayoutBoxS}>{VideoList}</div>;
};
