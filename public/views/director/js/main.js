var localstream;
var clients = new Object();
var peer;

/* NEED:
  * unique ID of this (director) client
  * unique ID of all clients per role
    (i.e. CAM1: 0328, 0523; CAM2: 0542)
  * function to broadcast data to all clients of certain role
  * event for incoming data from any role.
*/

// connect to broker for peer ID
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
    $('<div class="tallypoint" id="' + role + '-tally"></div>').appendTo('#tallyIndicator');
    // add TX button
    $('<button class="btn btn-success txButton" id="' + role + '-muteTx"' + '>' + role + '</button>').bind("click", muteTx).appendTo('#txControl');
    // add RX button
    $('<button class="btn btn-success rxButton" id="' + role + '-muteRx"' + '>' + role + '</button>').bind("click", muteRx).appendTo('#rxControl');
};

function muteTx() {
    roleToMute = $(this).attr('id').substring(0, $(this).attr('id').length - 7);
    // send mute to all clients in role, wait for one to ACK and then change colour
}

function muteRx() {
    roleToMute = $(this).attr('id').substring(0, $(this).attr('id').length - 7);
    // mute locally all players for role and then change colour
}

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

function callAllClients(){
    var i;
    for (key in clients){
        for    (i = 0; i < clients[key].length; i++) {
            startCall(clients[key][i]);
        };
    };
};
