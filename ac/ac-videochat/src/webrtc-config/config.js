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

const sendOnlyMediaConstraints = {
  audio: true,
  video: {
    width: { ideal: 320 },
    frameRate: { ideal: 15 }
  }
};

const sendOnlyOfferConstraintChrome = {
  mandatory: {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
  }
};

const sendOnlyOfferConstraintFirefox = {
  offerToReceiveAudio: 0,
  offerToReceiveVideo: 0
};

const recvOnlyOfferConstraintChrome = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  }
};

const recvOnlyOfferConstraintFirefox = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

export default {
  rtcConfiguration: rtcConfiguration,
  signalServerURL: signalServerURL,
  sendOnlyMediaConstraints: sendOnlyMediaConstraints,
  sendOnlyOfferConstraintChrome: sendOnlyOfferConstraintChrome,
  sendOnlyOfferConstraintFirefox: sendOnlyOfferConstraintFirefox,
  recvOnlyOfferConstraintChrome: recvOnlyOfferConstraintChrome,
  recvOnlyOfferConstraintFirefox: recvOnlyOfferConstraintFirefox
};
