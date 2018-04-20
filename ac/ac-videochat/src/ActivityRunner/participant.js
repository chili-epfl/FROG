function Participant(name, id, sendMessageF) {
    this.name = name;
    this.id = id;
    var rtcPeer;
    var sendMessage = sendMessageF;
	var isSendOnly = null;
	var self = this;

	console.log("Creted Particiapnt " + name + " " + id);

	this.createSendOnlyPeer = function(options){
		this.isSendOnly = true;
		console.log("CreteSendOnlyPeer()");
		var self = this;
		navigator.getUserMedia({ video: true, audio: true }, function (myStream) {
            if(options && options.onAddLocalStream){
                options.onAddLocalStream(myStream);
			}

			rtcPeer = new RTCPeerConnection(options.configuration);
			rtcPeer.addStream(myStream);
            rtcPeer.onicecandidate = self.onIceCandidate;

			rtcPeer.createOffer((offer) => {
				console.log("Created offer for " + this.name);
				
				rtcPeer.setLocalDescription(offer);
				var msg =  { 
					id : "receiveVideoFrom",
					sender : id,
					userId: id,
					sdpOffer : offer.sdp
				};
				sendMessage(msg);
			}, (error) => {

				console.error("CreateOffer error ", error);
			},{
                mandatory: {
					OfferToReceiveVideo: false
                    ,OfferToReceiveAudio: false
                }
			}); 
			
        }, function (error) {
            console.log("Media already in use, or blocked");
            console.log(error);
        });
	}

	this.createRecvOnlyPeer = function(options){
		this.isSendOnly = false;
		console.log("CreteRecvOnlyPeer()");
		var self = this;

		rtcPeer = new RTCPeerConnection(options.configuration);
		rtcPeer.onicecandidate = self.onIceCandidate;
		rtcPeer.onaddstream = options.onaddstream;

		rtcPeer.createOffer((offer) => {
			console.log("Created offer (recvonly) for " + this.name);
			//console.log(offerSdp.sdp);

			rtcPeer.setLocalDescription(offer);
			console.log("Created offer");
			var msg =  { 
				id : "receiveVideoFrom",
				sender : name,
				userId: id,
				sdpOffer : offer.sdp
			};
			if(options) {
				if(options.reload){
					msg =  { 
						id : "reloadStreamFrom",
						sender : name,
						userId: id,
						sdpOffer : offer.sdp
					};
				}
			} 
			sendMessage(msg);
		}, (error) => {

			console.error("CreateOffer error ", error);
		}, {
			mandatory: {
				OfferToReceiveVideo: true
				,OfferToReceiveAudio: true
			}
		});
	}

	function useH264(offer){
		offer.sdp = offer.sdp.replace(/VP8/g, "H264");
		return offer;
	}

	this.processAnswer = function(_answer) {
		console.log("Answer from " + this.name);
		//console.log(_answer);
		var answer = new RTCSessionDescription({
			type: 'answer',
			sdp: _answer
		});
		console.log("Setting answer");
		rtcPeer.setRemoteDescription(answer);
	}

	this.onRemoteCandidate = function(candidate){
		//console.log(candidate);
		try {
			rtcPeer.addIceCandidate(new RTCIceCandidate(candidate));

		} catch (error) {
			console.log("ERROR");
			console.error(error);
		}
	}

	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error")
		console.log('Invoking SDP offer callback function');
		var msg =  { 
			id : "receiveVideoFrom",
			sender : name,
			userId: id,
			sdpOffer : offerSdp
		};
		sendMessage(msg);
	}

	this.onIceCandidate = function (candidate) {
		var self = this;

		try {
			if(event) {
				if(event.candidate) {
					var message = {
						id: 'onIceCandidate',
						candidate: event.candidate,
						name: name,
						userId: id
					};
					sendMessage(message);
				}
			}
		} catch (error) {
			console.log("ERROR on ice candidate");
			console.error(error);
		}
	}

	// this.writeStats = function () {
	// 	// var pc = this.rtcPeer.peerConnection;
	// 	// console.log("STATS");
	// 	// window.getStats(
	// 	// 	pc,
	// 	// 	(result) => {
	// 	// 		//console.log(result.video);
	// 	// 	},
	// 	// 	5000
	// 	// );

	// 	var pc = rtcPeer;

	// 	var selector;
	// 	if(this.isSendOnly) {
	// 		selector = pc.getLocalStreams()[0].getVideoTracks()[0];
	// 	} else {
	// 		selector = pc.getRemoteStreams()[0].getVideoTracks()[0]
	// 	}
	// 	console.log(selector);
	// 	pc.getStats(selector, (result) => {
	// 		var key = Object.keys(result).filter(k => k.startsWith("ssrc"));
	// 		console.log("Participant: " + this.name + " codec, " + result[key]["googCodecName"]);
	// 		var msg =  { 
	// 			id : "info",
	// 			name : name,
	// 			info : "Participant: " + this.name + " codec, " + result[key]["googCodecName"]
	// 		};
	// 		sendMessage(msg);
	// 		// console.log(result);
	// 	},(error) => {
	// 		console.error(error);
	// 	});

	// 	pc.getStats()

	// }



	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		// var selector;
		// if(this.isSendOnly) {
		// 	selector = rtcPeer.getLocalStreams()[0].getVideoTracks()[0];
		// 	selector.stop();
		// 	selector = rtcPeer.getLocalStreams()[0].getAudioTracks()[0];
		// 	selector.stop();
		// } else {
		// 	selector = rtcPeer.getRemoteStreams()[0].getVideoTracks()[0]
		// 	selector.stop();
		// 	selector = rtcPeer.getLocalStreams()[0].getAudioTracks()[0];			
		// 	selector.stop();
		// }
		this.disposeRtcPeer();
	};

	this.disposeRtcPeer = function(){
		rtcPeer.close();
		rtcPeer = null;
	}
}

module.exports = Participant;
