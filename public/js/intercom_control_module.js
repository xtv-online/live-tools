function intercom_control_module(){
    var localstream;
    var peer;
    var peerId;

    connectToBroker(identity._id, callClients);

    function callClients() {
        $.getJSON('http://localhost:3000/clients/api', function(data) {
            data.forEach(function(role) {
                if (role.hasTalkBack) {
                    console.log("Make Buttons for", role.shortName);
                    addButtons(role.shortName);
                    role.clients.forEach(function(client) {
                        if (client.isWebRtcCapable) {
                            console.log("Connecting to", client._id);
                            startCall(client._id)
                        }
                    });
                }
            });
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

    function addClient(peerId, role) {
        if(!clients.hasOwnProperty(role)){
            clients[role] = new Array();
            addButtons(role);
        };
        clients[role].push(peerId);
    };

    function addButtons(role){
        // add Tally
        $('<div class="point" id="' + role + '-tally"></div>').appendTo('#tallyIndicator');
        // add TX button
        $('<button class="btn-circle-lg btn btn-success txButton" id="' + role + '-muteTx"' + '>' + role + '</button>').bind("click", muteTx).appendTo('#txControl');
        // add RX button
        $('<button class="btn-circle-lg btn btn-success rxButton" id="' + role + '-muteRx"' + '>' + role + '</button>').bind("click", muteRx).appendTo('#rxControl');
        // add Status
        $('<div class="point" id="' + role + '-statu"></div>').appendTo('#statusIndicator');
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

    function muteTx(){
        
    };

    function muteRx(){
        
    };
}