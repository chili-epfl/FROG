export const onStreamAdded = (stream, options) => {
    if(options && options.local) {
        console.log("Received local stream");
    } 
    if(options && options.remote) {
        console.log("Received remote stream");
    }

    var speechEvents = hark(stream);

      speechEvents.on('speaking', function() {
        console.log('speaking');

        //self.name
        //show user on dashboard
        if(options && options.logger)
            logger({type: "videochat", payload: "<name>"})
      });

      speechEvents.on('stopped_speaking', function() {
        console.log('stopped_speaking');

        //self.name
      });
};

