type OptionsT = {
  configuration: Object,
  myStream: MediaStream,
  offerConstraints: Object,
  ontrack: Function,
  reload: boolean,
  onOfferError: Function,
  onError: Function
};

class Participant {
  name: string;
  id: string;
  sendMessage: Function;
  rtcPeer: RTCPeerConnection;
  options: OptionsT;
  mode: string;

  constructor(name, id, sendMessage) {
    this.name = name;
    this.id = id;
    this.sendMessage = sendMessage;
  }

  createPeer = (mode: string, options: OptionsT) => {
    if (!this.mode) {
      this.mode = mode;
    }
    if (!this.options) {
      this.options = options;
    }
    try {
      this.rtcPeer = new RTCPeerConnection(options.configuration);
      this.rtcPeer.onicecandidate = this.onIceCandidate;
      if (mode === 'sendOnly') {
        this.rtcPeer.addStream(options.myStream);
      } else if (mode === 'recvOnly' && options && options.ontrack) {
        this.rtcPeer.ontrack = options.ontrack;
      }

      this.rtcPeer.createOffer(
        offer => {
          this.rtcPeer.setLocalDescription(offer);
          let msg = {
            id: 'receiveVideoFrom',
            userId: this.id,
            sdpOffer: offer.sdp
          };
          if (options && options.reload) {
            msg = {
              id: 'reloadStreamFrom',
              userId: this.id,
              sdpOffer: offer.sdp
            };
          }
          this.sendMessage(msg);
        },
        error => {
          if (options && options.onOfferError) options.onOfferError(error);
        },
        options.offerConstraints
      );
    } catch (error) {
      if (options && options.onError) options.onError(error);
    }
  };

  createSendOnlyPeer = options => {
    this.createPeer('sendOnly', options);
  };

  createRecvOnlyPeer = options => {
    this.createPeer('recvOnly', options);
  };

  reloadStream = () => {
    this.dispose();

    const options = this.options;
    options.reload = true;
    this.createPeer(this.mode, options);
  };

  processAnswer = answerSdp => {
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSdp
    });
    this.rtcPeer.setRemoteDescription(answer);
  };

  onRemoteCandidate = candidate => {
    this.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
  };

  onIceCandidate = event => {
    if (event && event.candidate) {
      const message = {
        id: 'onIceCandidate',
        candidate: event.candidate,
        userId: this.id
      };
      this.sendMessage(message);
    }
  };

  toogleAudio = () => {
    const audioTracks = this.rtcPeer.getLocalStreams()[0].getAudioTracks()[0];
    audioTracks.enabled = !audioTracks.enabled;
  };

  toogleVideo = () => {
    const videoTrack = this.rtcPeer.getLocalStreams()[0].getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  };

  isAudioEnabled = () => {
    const audioTracks = this.rtcPeer.getLocalStreams()[0].getAudioTracks()[0];
    return audioTracks.enabled;
  };

  isVideoEnabled = () => {
    const videoTrack = this.rtcPeer.getLocalStreams()[0].getVideoTracks()[0];
    return videoTrack.enabled;
  };

  dispose = () => {
    this.disposeRtcPeer();
  };

  disposeRtcPeer = () => {
    this.rtcPeer.close();
    this.rtcPeer = null;
  };
}

export default Participant;
