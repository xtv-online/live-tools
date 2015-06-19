$(window).on('beforeunload', function(){
    socket.close();
});

var localstream;

// connect to broker for 
var peer = new Peer(getURLParameter('id'), {key: PEERJSKEY});

$(document).ready(function() {
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
      }
    );
    
    // open peer connection
    peer.on('open', function(id)
    {
        $('#welcome').text("Connected as: " + id); // show peer ID in DOM to show connect success
    });
    
    // RX VOX
    peer.on('call', function(call) {
        console.log('Received Call: ', call);
        call.answer(localstream); // Answer the call with an audio stream.
        call.on('stream', function(remoteStream) {
            console.log('Playing remote stream ', remoteStream);

            // create new <audio> object in #playback for playback
            jQuery('<audio/>', {
                id: call.peer + '-player',
                autoplay: true,
            }).appendTo('#playback');
            audio = document.getElementById(call.peer + '-player');
            audio.src = URL.createObjectURL(remoteStream);
            document.getElementById(call.peer + '-player').muted = true;
        });        
    });
    
    // RX REMOTE CONTROL
    peer.on('connection', function(conn) {
        console.log('connection');
        conn.on('data', function(data){
            audio = document.getElementById(conn.peer + '-player');
            audio.muted ? audio.muted = false : audio.muted = true;
            console.log(conn.peer, data, audio.muted);
        });
    });

    
    $( "#startCall" ).click(function() {
        startCall($('#destination').val());
        
        // todo: instead of 'toggle', send 'mute' or 'unmute' in case message gets lost in transfer..
        $('<button class="togglemutetx btn btn-danger" id="' + $('#destination').val() + '-mutetx"' + '>' + $('#destination').val() + '</button>').bind("click", toggleMuteTx).appendTo('#txcontrol');
        $('<button class="togglemuterx btn btn-success" id="' + $('#destination').val() + '-muterx"' + '>' + $('#destination').val() + '</button>').bind("click", toggleMuteRx).appendTo('#rxcontrol');
        
    });

});

function getURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

// TX REMOTE CONTROL
function toggleMuteTx() {
    idToMute = $(this).attr('id').substring(0, $(this).attr('id').length - 7);
    console.log("Muting RX to", idToMute);
    conn = peer.connect(idToMute, reliable = true);
    console.log('Sending toggle to', idToMute, conn);
    conn.on('open', function(){
        conn.send('Toggle');
    });
    $(this).toggleClass( "btn-danger" );
    $(this).toggleClass( "btn-success" );
};

// RX LOCAL CONTROL
function toggleMuteRx() {
    idToMute = $(this).attr('id').substring(0, $(this).attr('id').length - 7);
    console.log("Muting RX from", idToMute);
    audio = document.getElementById(idToMute + '-player');
    audio.muted ? audio.muted = false : audio.muted = true;
    $(this).toggleClass( "btn-danger" );
    $(this).toggleClass( "btn-success" );
};

// TX
function startCall(destination)
{
    console.log('Calling ', destination, ' with ', localstream);
    var call = peer.call(destination, localstream);
    call.on('stream', function(remoteStream) {
        console.log('Playing remote stream ', remoteStream);
          
        // create new <audio> object in #playback for playback
        jQuery('<audio/>', {
            id: destination + '-player',
            autoplay: true,
        }).appendTo('#playback');
        audio = document.getElementById(destination + '-player');
        audio.src = URL.createObjectURL(remoteStream);
    });
}