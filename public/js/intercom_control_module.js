/*
 * So how does this work?
 * - When director starts programme, it calls all 
 *   others that are connected and have WebRTC functionality.
 * - An HTML5 <audio> element is created on the client's side
 *   to listen to the director
 * - For each clieant, an HTML5 <audio> element is created on
 *   the director's side
 * - Audio data is sent through the WebRTC connection by peerJS
 * - Mute/Unmute data is sent through socket.io websockets
 * - Clients can
 *   a. mute/unmute the director:
 *      - <audio> element is set to muted/unmuted
 *      - director is sent notification (A1/A2)
 *      - the buttons change colour 
 *      - These are actions A1 & A2
 *   b. mute/unmute themselves for the director:
 *      - notification is sent to director
 *      - director's <audio> playback element for
 *        that role is muted/unmuted
 *      - director sends confirmation back (B3/B4)
 *      - buttons change colour when confirmation
 *        received
 *      - These are actions A3 & A4
 * - The Director can
 *   a. mute/unmute clients individually
 *      - <audio> playback element for that role
 *        is muted/unmuted
 *      - clients are sent notification (B3/B4)
 *      - buttons change colour
 *      - These are actions B3 & B4
 *   b. mute/unmute themselves for each client
 *      - notification is sent to client (B1/B2)
 *      - director's <audio> playback element on
 *        client's side is muted
 *      - client sends confirmation back (A2/A1)
 *      - buttons change colour
 *      - These are actions B1 & B2.
 * Please see issue #5 on github for more detail.
 * */


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
                    enableButton = false;
                    role.clients.forEach(function(client) {
                        if (client.isWebRtcCapable) {
                            startCall(client._id)
                            enableButton = true;
                        }
                    });
                    addButtons(role.shortName, role._id, enableButton);
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

    function addButtons(roleName, roleId, callActive){
        // add Tally
        $('<div class="point" id="' + roleId + '-tally"></div>').appendTo('#tallyIndicator');
        if (callActive){
            // add TX button
            $('<button class="btn-circle-lg btn btn-success txButton" id="' + roleId + '-muteTx"' + '>' + roleName + '</button>').bind("click", muteTx).appendTo('#txControl');
            // add RX button
            $('<button class="btn-circle-lg btn btn-success rxButton" id="' + roleId + '-muteRx"' + '>' + roleName + '</button>').bind("click", muteRx).appendTo('#rxControl');
        } else {
            // add TX button
            $('<button class="btn-circle-lg btn btn-default txButton" id="' + roleId + '-muteTx"' + '>' + roleName + '</button>').appendTo('#txControl');
            // add RX button
            $('<button class="btn-circle-lg btn btn-default rxButton" id="' + roleId + '-muteRx"' + '>' + roleName + '</button>').appendTo('#rxControl');
        }
        // add Status
        $('<div class="point status" id="' + roleId + '-status"></div>').appendTo('#statusIndicator');
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
            // B1
            socket.emit('tell client to listen to director', roleToMute);
        } else {
            // mute
            // B2
            socket.emit('tell client to not listen to director', roleToMute);
        };
    };

    function muteRx(){
        buttonId = $(this).attr('id')
        roleToMute = buttonId.substring(0, $(this).attr('id').length - 7);
        if ($("#" + buttonId).hasClass( 'btn-danger' )) {
            // unmute
            unmutePlayer(roleToMute);
        } else {
            // mute
            mutePlayer(roleToMute);
        };
    };

    function mutePlayer(playerId){
        clientData.forEach(function(role) {
            if(role._id == playerId){
                role.clients.forEach(function(client) {
                    document.getElementById(client._id + '-player').muted = true;
                })
            }
            else {
                console.log(':(');
            }
        });
        // B3
        socket.emit('tell client that director is not listening', roleToMute);
        $('#' + playerId + '-muteRx').removeClass( 'btn-success' );
        $('#' + playerId + '-muteRx').addClass( 'btn-danger' );
    }

    function unmutePlayer(playerId){
        clientData.forEach(function(role) {
            if(role._id == playerId){
                role.clients.forEach(function(client) {
                    document.getElementById(client._id + '-player').muted = false;
                })
            }
            else {
                console.log(':(');
            }
        });

        // B4
        socket.emit('tell client that director is listening', roleToMute);
        $('#' + playerId + '-muteRx').removeClass( 'btn-danger' );
        $('#' + playerId + '-muteRx').addClass( 'btn-success' );
    }

    // A1
    socket.on('director: client not listening', function(roleId){
        $("#" + roleId + "-muteTx").removeClass( 'btn-success' );
        $("#" + roleId + "-muteTx").addClass( 'btn-danger' );
    });

    // A2
    socket.on('director: client listening', function(roleId){
        $("#" + roleId + "-muteTx").addClass( 'btn-success' );
        $("#" + roleId + "-muteTx").removeClass( 'btn-danger' );
    });

    //A3
    socket.on('director: listen to client', function(roleId){
        // unmute if muted
        unmutePlayer(roleId);
    });

    //A4
    socket.on('director: stop listening to client', function(roleId){
        // unmute if muted
        mutePlayer(roleId);
    });
}
