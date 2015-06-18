$(window).on('beforeunload', function(){
    socket.close();
});

var localstream;

$(document).ready(function() {
    $( "#startCall" ).click(function() {
        startCall($('#destination').val());
    });
    
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

function startCall(destination)
{
    console.log('Calling ', destination, ' with ', localstream);
    var call = peer.call(destination, localstream);
    call.on('stream', function(remoteStream) {
      console.log('Playing remote stream ', remoteStream);
      audio.src = URL.createObjectURL(remoteStream);
    });
    
}