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

export const signalServerURL = 'wss://frog-marin.tk:443/webrtc';

const sendOnlyMediaConstraints = {
  audio: true,
  video: {
    width: { ideal: 320 },
    frameRate: { ideal: 15 }
  }
};

export default {
  rtcConfiguration: rtcConfiguration,
  signalServerURL: signalServerURL,
  sendOnlyMediaConstraints: sendOnlyMediaConstraints
}