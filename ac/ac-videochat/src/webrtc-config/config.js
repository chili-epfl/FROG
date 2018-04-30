export const rtcConfiguration = {
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

export const signalServerURL = 'wss://osls-signal-server.tk:443/osls';
