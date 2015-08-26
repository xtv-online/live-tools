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
            // A2
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
        } else {
            // mute
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            //A1
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
        };
    });

    $(localTxButton).click(function() {
        if (!$(localTxButton).hasClass( 'highlighted' )) {
            // A3
            socket.emit('tell director to listen to client', identity.role[0]._id);
           // toggle class on director confirm
        } else {
            // A4
           socket.emit('tell director to stop listening to client', identity.role[0]._id);
           // toggle class on director confirm
       };
    });

    // B3
    socket.on('client: director not listening', function(roleId) {
        console.log('got a B2 for ' + roleId);
        if (roleId == identity.role[0]._id){
            $(localTxButton).removeClass( 'highlighted' );
        };
    });

    // B4
    socket.on('client: director is listening', function(roleId) {
        console.log('got a B4 for ' + roleId);
        if (roleId == identity.role[0]._id){
            $(localTxButton).addClass( 'highlighted' );
        };
    });

    // B2
    socket.on('client: stop listening to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = true;
            // A1
            socket.emit('tell director that client is not listening to director', identity.role[0]._id);
            $(localPlaybackButton).removeClass( 'highlighted' );
        };
    });

    // B1
    socket.on('client: listen to director', function(roleId) {
        if (roleId == identity.role[0]._id){
            document.getElementById(localPlaybackAudio.substring(1)).muted = false;
            //A2
            socket.emit('tell director that client is listening to director', identity.role[0]._id);
            $(localPlaybackButton).addClass( 'highlighted' );
        };
    });
};
