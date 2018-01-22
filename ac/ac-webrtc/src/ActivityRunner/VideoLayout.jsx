// @flow

import React from 'react';
import Video from './Video';

type VideosPropsT = { local: Object, remote: Array<Object> };

const VideoBoxS = {
  maxWidth: '400px',
  minWidth: '200px',
  flex: '0 1 auto',
  margin: 'auto'
};

const LayoutBoxS = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap'
};

export default ({ local, remote }: VideosPropsT) => {
  const VideoList = [
    <div style={VideoBoxS} key="local">
      <Video src={local.src} self />
    </div>,
    ...remote.map((connection, index) => (
      <div style={VideoBoxS} key={connection.remoteUser.id}>
        <Video
          index={'remotevideo' + index}
          src={connection.src}
          name={connection.remoteUser.name}
        />
      </div>
    ))
  ];
  return <div style={LayoutBoxS}>{VideoList}</div>;
};
