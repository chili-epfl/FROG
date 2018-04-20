// @flow

import React from 'react';

type VideoPropsT = Object;

export default ({ videoId, self }: VideoPropsT) => (
  <video
    playsInline
    id={videoId}
    autoPlay
    muted={self}
    height="100%"
    width="100%"
  />
);
