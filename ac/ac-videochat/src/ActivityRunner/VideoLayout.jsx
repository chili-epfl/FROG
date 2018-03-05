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
  const VideoList =
    remote.length > 0 ? (
      <React.Fragment>
        <div style={VideoBoxS} key="local">
          <Video src={local.src} self />
          {local.user && (
            <p>
              <i>Local: {local.user}</i>
            </p>
          )}
        </div>
        {remote.map((connection, index) => (
          <div style={VideoBoxS} key={connection.remoteUser.id}>
            <Video
              index={'remotevideo' + index}
              src={connection.src}
              name={connection.remoteUser.name}
            />
            <p>{connection.remoteUser && connection.remoteUser.name}</p>
          </div>
        ))}
      </React.Fragment>
    ) : (
      <h2>Waiting for other users to join</h2>
    );
  return <div style={LayoutBoxS}>{VideoList}</div>;
};
