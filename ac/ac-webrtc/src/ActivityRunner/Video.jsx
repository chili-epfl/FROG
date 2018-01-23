// @flow

import React from 'react';

type VideoPropsT = Object;

export default ({ src, self }: VideoPropsT) => (
  <video
    playsInline
    id="localVideo"
    autoPlay
    muted={self}
    src={src}
    height="100%"
    width="100%"
  />
);
