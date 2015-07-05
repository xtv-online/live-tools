function intercom_control_module(localPlaybackAudio){
    var localstream;
    var peer;
    var peerId;
    var clientData;

    connectToBroker(identity._id, callClients);

    function callClients() {
        $.getJSON(location.protocol + '//' + location.host + '/clients/api', function(data) {
            data.forEach(function(role) {
                if (role.hasTalkBack) {
                    addButtons(role.shortName, role._id);
                    role.clients.forEach(function(client) {
                        if (client.isWebRtcCapable) {
                            startCall(client._id)
                        }
                    });
                }
            });
            clientData = data;
        });
    }

    function connectToBroker(id, callback){
        peer = new Peer(id, {key: PEERJSKEY});

        // init microphone
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // save stream object pointer
        navigator.getUserMedia(
          {video: false, audio: true},
          function(stream) {
            localstream = stream;
            callback();
          },
          function(err) {
            console.log('Failed to get local stream' ,err);
        });

    };

    function addButtons(roleName, roleId){
        // add Tally
        $('<div class="point" id="' + roleId + '-tally"></div>').appendTo('#tallyIndicator');
        // add TX button
        $('<button class="btn-circle-lg btn btn-success txButton" id="' + roleId + '-muteTx"' + '>' + roleName + '</button>').bind("click", muteTx).appendTo('#txControl');
        // add RX button
        $('<button class="btn-circle-lg btn btn-success rxButton" id="' + roleId + '-muteRx"' + '>' + roleName + '</button>').bind("click", muteRx).appendTo('#rxControl');
        // add Status
        $('<div class="point" id="' + roleId + '-statu"></div>').appendTo('#statusIndicator');
    };

    function startCall(destination)
    {
        var call = peer.call(destination, localstream);
        call.on('stream', function(remoteStream) {
            // create new <audio> object in #playback for playback
            jQuery('<audio/>', {
                id: destination + '-player',
                autoplay: true,
            }).appendTo('#playback');
            audio = document.getElementById(destination + '-player');
            audio.src = URL.createObjectURL(remoteStream);
        });
        // send signal to all clients that not muted
    };


    // mute director's playback on selected role
    function muteTx(){
        buttonId = $(this).attr('id')
        roleToMute = buttonId.substring(0, $(this).attr('id').length - 7);
        if ($("#" + buttonId).hasClass( 'btn-danger' )) {
            // unmute
            socket.emit('tell client to listen to director', roleToMute);
        } else {
            // mute
            socket.emit('tell client to not listen to director', roleToMute);
        };
    };

    function muteRx(){

    };

    socket.on('director: client not listening', function(roleId){
        socket.emit('tell client to not listen to director', roleId);
        $("#" + roleId + "-muteTx").removeClass( 'btn-success' );
        $("#" + roleId + "-muteTx").addClass( 'btn-danger' );
    });

    socket.on('director: client listening', function(roleId){
        socket.emit('tell client to listen to director', roleId);
        $("#" + roleId + "-muteTx").addClass( 'btn-success' );
        $("#" + roleId + "-muteTx").removeClass( 'btn-danger' );
    });



}
