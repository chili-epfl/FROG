import React, { Component } from 'react';

const LocalVideo = ({ stream, src }) => {
  return (
    <video
      playsInline
      id="localVideo"
      height="200px"
      autoPlay
      muted="true"
      src={src}
    />
  );
};

const RemoteVideo = ({ stream, src, index, name }) => {
  return(
    <div>
      <video 
        playsInline
        id={index} 
        height="200px"
        autoPlay 
        src={src} 
      />
      <h2>{name}</h2>
    </div>
  );
};

export {LocalVideo, RemoteVideo};