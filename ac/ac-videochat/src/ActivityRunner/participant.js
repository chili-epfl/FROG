function Participant(name, id, sendMessage) {
  this.name = name;
  this.id = id;
  var rtcPeer;
  this.options;
  this.mode;
  var self = this;

  var createPeer = (mode, options) => {
    if (!this.mode) {
      this.mode = mode;
    }
    if (!this.options) {
      this.options = options;
    }
    console.log(options);
    try {
      //   if (mode === 'sendOnly' && options && options.onaddstream) {
      //     options.onaddstream(options.myStream);
      //   }

      rtcPeer = new RTCPeerConnection(options.configuration);
      rtcPeer.onicecandidate = self.onIceCandidate;

      if (mode === 'sendOnly') {
        rtcPeer.addStream(options.myStream);
      } else if (mode === 'recvOnly' && options && options.onaddstream) {
        rtcPeer.onaddstream = options.onaddstream;
      }

      rtcPeer.createOffer(
        offer => {
          rtcPeer.setLocalDescription(offer);
          var msg = {
            id: 'receiveVideoFrom',
            userId: id,
            sdpOffer: offer.sdp
          };
          if (options && options.reload) {
            msg = {
              id: 'reloadStreamFrom',
              userId: id,
              sdpOffer: offer.sdp
            };
          }
          sendMessage(msg);
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

  this.createSendOnlyPeer = options => {
    createPeer('sendOnly', options);
  };

  this.createRecvOnlyPeer = options => {
    createPeer('recvOnly', options);
  };

  this.reloadStream = () => {
    this.dispose();

    var options = this.options;
    options.reload = true;
    createPeer(this.mode, options);
  };

  this.processAnswer = function(answerSdp) {
    var answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSdp
    });
    rtcPeer.setRemoteDescription(answer);
  };

  //can throw exception
  this.onRemoteCandidate = function(candidate) {
    rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));
  };

  this.onIceCandidate = function(event) {
    if (event && event.candidate) {
      //console.log('Sending local ice, ', event.candidate);
      var message = {
        id: 'onIceCandidate',
        candidate: event.candidate,
        userId: id
      };
      sendMessage(message);
    }
  };

  this.toogleAudio = function(sendAudio) {
    var audioTracks = rtcPeer.getLocalStreams()[0].getAudioTracks()[0];
    audioTracks.enabled = !audioTracks.enabled;
  };

  this.toogleVideo = function(sendVideo) {
    var videoTrack = rtcPeer.getLocalStreams()[0].getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
  };

  this.isAudioEnabled = function() {
    var audioTracks = rtcPeer.getLocalStreams()[0].getAudioTracks()[0];
    return audioTracks.enabled;
  };

  this.isVideoEnabled = function() {
    var videoTrack = rtcPeer.getLocalStreams()[0].getVideoTracks()[0];
    return videoTrack.enabled;
  };

  this.dispose = function() {
    this.disposeRtcPeer();
  };

  this.disposeRtcPeer = function() {
    rtcPeer.close();
    rtcPeer = null;
  };
}

module.exports = Participant;
