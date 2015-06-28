function intercom_listen_module(localPlaybackButton, localPlaybackAudio, localTxButton) {
    
    var localstream;
    var peer;
    connectToBroker(identity._id);
    
    function connectToBroker(id){
        peer = new Peer(id, {key: PEERJSKEY});

        // init microphone
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // save stream object pointer
        navigator.getUserMedia(
          {video: false, audio: true},
          function(stream) {
            localstream = stream;
          },
          function(err) {
            console.log('Failed to get local stream' ,err);
        });
        
        // RX VOX
        peer.on('call', function(call) {
            console.log('Received Call: ', call);
            call.answer(localstream); // Answer the call with an audio stream.
            call.on('stream', function(remoteStream) {
                console.log('Playing remote stream ', remoteStream);
                $("#director-playback").attr("src", URL.createObjectURL(remoteStream));
            });        
        });
        
    };

    $(localPlaybackButton).click(function() {
        if (!$(localPlaybackButton).hasClass( 'highlighted' )) {
            // unmute
            document.getElementById(localPlaybackAudio.substring(1)).muted = false;
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
        } else {
            // mute
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
        };
    });
     
    $(localTxButton).click(function() {
        if (!$(localTxButton).hasClass( 'highlighted' )) {
            socket.emit('tell director to listen to client', identity.role[0]._id);
           // toggle class on director confirm
        } else {
           socket.emit('tell director to stop listening to client', identity.role[0]._id);
           // toggle class on director confirm
       };
    });
     
    socket.on('client: director not listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            $(localTxButton).removeClass( 'highlighted' );
        };
    });    
    
    socket.on('client: director is listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            $(localTxButton).addClass( 'highlighted' );
        };
    });   
    
    socket.on('client: stop listening to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            $(localPlaybackButton).removeClass( 'highlighted' );
        };
    });    
    
    socket.on('client: listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = false;
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
            $(localPlaybackButton).addClass( 'highlighted' );
        };
    });
};