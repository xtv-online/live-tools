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
        if ($(localPlaybackButton).hasClass( 'btn-danger' )) {
            // unmute
            document.getElementById(localPlaybackAudio.substring(1)).muted = false;
            socket.emit('tell director that client is listening to director', identity.role[0]._id);        
            $(localPlaybackButton).toggleClass( 'btn-success' );
            $(localPlaybackButton).toggleClass( 'btn-danger' );
        } else {
            // mute
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            $(localPlaybackButton).toggleClass( 'btn-success' );
            $(localPlaybackButton).toggleClass( 'btn-danger' );
        };
    });
     
    $(localTxButton).click(function() {
        if ($(localTxButton).hasClass( 'btn-danger' )) {
            socket.emit('tell director to listen to client', identity.role[0]._id);
           // toggle class on director confirm
        } else {
           socket.emit('tell director to stop listening to client', identity.role[0]._id);
           // toggle class on director confirm
       };
    });
     
    socket.on('tell client that director is not listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            if ($(localTxButton).hasClass( 'btn-success' )) {
                // mute
                $(localTxButton).toggleClass( 'btn-success' );
                $(localTxButton).toggleClass( 'btn-danger' );
            };
        };
    });    
    
    socket.on('tell client that director is listening', function(roleId) {
        if (roleId == identity.role[0]._id){
            if ($(localTxButton).hasClass( 'btn-danger' )) {
                // mute
                $(localTxButton).toggleClass( 'btn-success' );
                $(localTxButton).toggleClass( 'btn-danger' );
            }; 
        };
    });   
    
    socket.on('tell client to not listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            if ($(localPlaybackButton).hasClass( 'btn-success' )) {
                // mute
                $(localPlaybackButton).toggleClass( 'btn-success' );
                $(localPlaybackButton).toggleClass( 'btn-danger' );
            };
        };
    });    
    
    socket.on('tell client to listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
            if ($(localPlaybackButton).hasClass( 'btn-danger' )) {
                // mute
                $(localPlaybackButton).toggleClass( 'btn-success' );
                $(localPlaybackButton).toggleClass( 'btn-danger' );
            };
        };
    });
};