function Participant(name, id, sendMessageF) {
    this.name = name;
    this.id = id;
    var rtcPeer;
    var sendMessage = sendMessageF;
	var isSendOnly = null;
	var self = this;

	console.log("Created Particiapnt " + name + " " + id);

	this.createSendOnlyPeer = options => {
		this.isSendOnly = true;
		console.log("CreteSendOnlyPeer()");
		var self = this;
		navigator.mediaDevices.getUserMedia(options.userMediaConstraints)
		.then(myStream => {
			try {
				if(options && options.onAddLocalStream){
					options.onAddLocalStream(myStream);
				}
	
				rtcPeer = new RTCPeerConnection(options.configuration);
				rtcPeer.addStream(myStream);
				rtcPeer.onicecandidate = self.onIceCandidate;
	
				rtcPeer.createOffer((offer) => {
					console.log("Created offer for " + self.name);
					
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
			} catch (error) {
				console.log("Error in create Send only peer after obtaining media", error);
			}	
		})
		.catch(error => {
            console.log("Media already in use, or blocked");
            console.log(error);
        });
	}

	this.createRecvOnlyPeer = options => {
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

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		this.disposeRtcPeer();
	};

	this.disposeRtcPeer = function(){
		rtcPeer.close();
		rtcPeer = null;
	}
}

module.exports = Participant;
