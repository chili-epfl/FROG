// @flow

type OptionsT = {
  configuration: Object,
  myStream: MediaStream,
  offerConstraints: Object,
  ontrack: Function,
  reload: boolean,
  onOfferError: Function,
  onError: Function
};

declare var RTCIceCandidate: any;
declare var RTCPeerConnection: any;
declare var RTCSessionDescription: any;

class Participant {
  name: string;
  id: string;
  role: string;
  sendMessage: Function;
  rtcPeer: RTCPeerConnection;
  options: OptionsT;
  mode: string;
  isRemoteDescriptionSet: boolean;

  constructor(name: string, id: string, role: string, sendMessage: Function) {
    this.name = name;
    this.id = id;
    this.role = role;
    this.sendMessage = sendMessage;
  }

  createPeer = (mode: string, options: Object) => {
    if (!this.mode) {
      this.mode = mode;
    }
    if (!this.options) {
      this.options = options;
    }
    try {
      this.rtcPeer = new RTCPeerConnection(options.configuration);
      this.rtcPeer.onicecandidate = this.onIceCandidate;
      if (mode === 'sendonly' || mode === 'sendrecv') {
        this.rtcPeer.addStream(options.myStream);
      } else if (mode === 'recvonly' && options.ontrack) {
        this.rtcPeer.ontrack = options.ontrack;
      }

      const offerOptions = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      };

      if (mode === 'sendOnly') {
        offerOptions.offerToReceiveAudio = 0;
        offerOptions.offerToReceiveVideo = 0;
      }

      if (mode === 'sendrecv') {
        this.rtcPeer
          .createOffer()
          .then(this.onOffer)
          .catch(this.onOfferError);
      } else {
        this.rtcPeer
          .createOffer(offerOptions)
          .then(this.onOffer)
          .catch(this.onOfferError);
      }
    } catch (error) {
      if (options && options.onError) options.onError(error);
    }
  };

  onOffer = (offer: Object) => {
    this.rtcPeer.setLocalDescription(offer);
    let msg = {
      id: 'receiveVideoFrom',
      userId: this.id,
      sdpOffer: offer.sdp
    };
    if (this.options && this.options.reload) {
      msg = {
        id: 'reloadStreamFrom',
        userId: this.id,
        sdpOffer: offer.sdp
      };
    }
    this.sendMessage(msg);
  };

  onOfferError = (error: Object) => {
    console.error(error);
  };

  reloadStream = () => {
    this.dispose();

    const options = this.options;
    options.reload = true;
    this.createPeer(this.mode, options);
  };

  processAnswer = (answerSdp: string) => {
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSdp
    });
    this.rtcPeer.setRemoteDescription(answer).then(() => {
      this.isRemoteDescriptionSet = true;
    });
  };

  onRemoteCandidate = (candidate: Object) => {
    this.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
  };

  onIceCandidate = (event: Object) => {
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
    if (this.rtcPeer) {
      this.rtcPeer.close();
      this.rtcPeer = null;
    }
  };
}

export default Participant;
