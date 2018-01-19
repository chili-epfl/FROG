// @flow

import React from 'react';
import Video from './Video';

type VideosPropsT = { local: Object, remote: Array<Object>}

const LayoutList = ({ local, remote }: VideosPropsT) =>
  <div id="videos">
    <Video
      src={local.src}
      self={true}
    />
    {remote.length > 0
      ? remote.map((connection, index) => (
          <Video
            key={connection.remoteUser.id}
            index={'remotevideo' + index}
            src={connection.src}
            name={connection.remoteUser.name}
          />
        ))
      : (
        <h1>Wait until somebody connects. </h1>
      )}
  </div>

export default (props: VideosPropsT) =>
  <LayoutList {...props} />
