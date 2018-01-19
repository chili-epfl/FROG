// @flow

import React from 'react';

type VideoPropsT = Object

export const LocalVideo = ({ src }) => (
  <video
    playsInline
    id="localVideo"
    height="200px"
    autoPlay
    muted="true"
    src={src}
  />
);

export const RemoteVideo = ({ src, index, name }) => (
  <div>
    <video playsInline id={index} height="200px" autoPlay src={src} />
    <h2>{name}</h2>
  </div>
);

export default ({ src, self }: VideoPropsT) => (
  <video
    playsInline
    id="localVideo"
    autoPlay
    muted={self}
    src={src}
  />
);
