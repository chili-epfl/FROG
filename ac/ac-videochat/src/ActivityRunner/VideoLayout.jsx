// @flow

import * as React from 'react';
import Video from './Video';

type VideosPropsT = { local: Object, remote: Array<Object> };

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

export default ({ local, remote }: VideosPropsT) => {
  console.log(remote);
  const VideoList =
      <React.Fragment>
        <div style={VideoBoxS} key="local">
          <Video videoId={local.id} self />
          {local.name && (
            <p>
              <i>Local: {local.name}</i>
            </p>
          )}
        </div>
        {remote.map((participant, index) => (
          <div style={VideoBoxS} key="remote">
            <Video
              videoId={participant.id}
              index={'remotevideo' + index}
              name={participant.name}
            />
            <p>{participant.name}</p>
          </div>
        ))}
      </React.Fragment>

  return <div style={LayoutBoxS}>{VideoList}</div>;
};
