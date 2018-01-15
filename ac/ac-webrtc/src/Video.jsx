import React from 'react';

const LocalVideo = ({ src }) => (
  <video
    playsInline
    id="localVideo"
    height="200px"
    autoPlay
    muted="true"
    src={src}
  />
);

const RemoteVideo = ({ src, index, name }) => (
  <div>
    <video playsInline id={index} height="200px" autoPlay src={src} />
    <h2>{name}</h2>
  </div>
);

export { LocalVideo, RemoteVideo };
