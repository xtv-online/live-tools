$(function() {
    // temp for debugging
    $("#timeofday").click(function() {
        addButtons('CAM1');
    });
    
    // toggle on air status
    var liveMouseDown;
    $('#livestatus').mousedown(function() {
      liveMouseDown = setTimeout(function() {
        switch($('#livestatus').css('background-color')) {
            case 'rgb(239, 65, 54)':
                socket.emit('status off air');
                break;
            case 'rgb(126, 0, 0)':
                socket.emit('status on air reset');
                break;
        }
      }, 1200);
    });
    $('#livestatus').mouseup(function() {
      if (liveMouseDown) {
        clearTimeout(liveMouseDown);
      }
    });
    
    $('#cdadd1m').click(function() {
    socket.emit('custom countdown 1m');
    });
    
    $('#cdadd10s').click(function() {
    socket.emit('custom countdown 10s');
    });
    
    $('#cdreset').click(function() {
        socket.emit('reset custom countdown');
    });
    
    $('#cdgo').click(function() {
        socket.emit('toggle custom countdown');
    });
    
    $('#cdtoggle').click(function() {
        socket.emit('toggle countdowns');
    });
    
    socket.on('custom active', function(customActive){
        toggleSelector = "#cdtoggle"
        if (customActive){
            if ($(toggleSelector).hasClass( 'btn-danger' )) {
                $(toggleSelector).toggleClass( 'btn-success' )
                $(toggleSelector).toggleClass( 'btn-danger' )
                $(toggleSelector).text('Show VT');
            };
        } else {
            if ($(toggleSelector).hasClass( 'btn-success' )) {
                $(toggleSelector).toggleClass( 'btn-success' )
                $(toggleSelector).toggleClass( 'btn-danger' )
                $(toggleSelector).text('Custom');
            };
        };
    });
    
    
    handshaking_module(ready);

    function ready() {

        // Set Up Tally
        if (identity.role[0].inputID !== 0) {
            tally_module(identity.role[0].inputID, '#display');
            $('#tally span').text(identity.role[0].shortName);
        }

        // Set up time of day
        timeofday_module('#timeofday span');

        // Setup Caspar Countdown Module
        casparcountdown_module('#countdown span', '#countdownTitle span');

        // Setup Custom Countdown
        customcountdown_module('#countdown span', '#countdownTitle span');

        // Setup Messaging Module
        messaging_module_initialise(newMessage, newAcknowledgement);

        // Setup RX time display
        txtime_module('#livetimer', '#livestatusText', '#livestatus');

    }

    
    function newAcknowledgement(sender) {
        console.log('Acknowledgement from ' + sender);
    }
    
    function newMessage(message, sender) {
        console.log('Message from ' + sender, message);
    }
    
    
});


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
    $('<div class="point" id="' + role + '-tally"></div>').appendTo('#tallyIndicator');
    // add TX button
    $('<button class="btn-circle-lg btn btn-success  txButton" id="' + role + '-muteTx"' + '>' + role + '</button>').bind("click", muteTx).appendTo('#txControl');
    // add RX button
    $('<button class="btn-circle-lg btn btn-success rxButton" id="' + role + '-muteRx"' + '>' + role + '</button>').bind("click", muteRx).appendTo('#rxControl');
    // add Status
    $('<div class="point" id="' + role + '-statu"></div>').appendTo('#statusIndicator');
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
