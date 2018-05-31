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
  isAnswerProcessed: boolean;
  remoteCandidates: Array<any>;
  senderVideo: Object;
  senderAudio: Object;
  cameraVideoTrack: Object;
  screenVideoTrack: Object;
  sendOnlyStream: Object;

  constructor(name: string, id: string, role: string, sendMessage: Function) {
    this.name = name;
    this.id = id;
    this.role = role;
    this.sendMessage = sendMessage;
    this.remoteCandidates = [];
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
        this.sendOnlyStream = options.myStream;
        this.cameraVideoTrack = options.myStream.getVideoTracks()[0];
        const audioTrack = options.myStream.getAudioTracks()[0];

        if (this.cameraVideoTrack) {
          this.senderVideo = this.rtcPeer.addTrack(
            this.cameraVideoTrack,
            options.myStream
          );
        }
        if (audioTrack) {
          this.senderAudio = this.rtcPeer.addTrack(
            audioTrack,
            options.myStream
          );
        }
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
      console.error(error);
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
      this.isAnswerProcessed = true;
      this.remoteCandidates.forEach(c =>
        this.rtcPeer.addIceCandidate(new RTCIceCandidate(c))
      );
    });
  };

  onRemoteCandidate = (candidate: Object) => {
    if (this.isAnswerProcessed) {
      this.rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      this.remoteCandidates.push(candidate);
    }
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

  startScreenShare = (screenStream: MediaStream) => {
    this.screenVideoTrack = screenStream.getVideoTracks()[0];

    // replace track in stream that is sending to other users
    this.senderVideo.replaceTrack(this.screenVideoTrack);

    // replace track in local video stream
    this.sendOnlyStream.removeTrack(this.cameraVideoTrack);
    this.sendOnlyStream.addTrack(this.screenVideoTrack);
  };

  stopScreenShare = () => {
    // replace track in stream that is sending to other users
    this.senderVideo.replaceTrack(this.cameraVideoTrack);

    // replace track in local video stream
    this.sendOnlyStream.removeTrack(this.screenVideoTrack);
    this.sendOnlyStream.addTrack(this.cameraVideoTrack);

    this.screenVideoTrack.stop();
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
