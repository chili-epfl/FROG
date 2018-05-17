// @flow

const rtcConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turn:frog-marin.tk:3478',
      username: 'test',
      credential: 'test'
    }
  ]
};

const signalServerURL = 'wss://icchilisrv3.epfl.ch:7777';

type MediaConstraintsT = {
  audio: boolean,
  video: false | { width: { ideal: number }, frameRate: { ideal: number } }
};
const mediaConstraints: MediaConstraintsT = {
  audio: true,
  video: {
    width: { ideal: 320 },
    frameRate: { ideal: 15 }
  }
};

export default {
  rtcConfiguration,
  signalServerURL,
  mediaConstraints
};
