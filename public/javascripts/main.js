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

$(function() {
    window.scrollTo(0,1);
    var inId = getURLParameter('in');
    $('#cam span').text(inId);
        
    
    var socket = io();

    socket.on('camera tally', function(inputNumber, state){
        console.log(inputNumber, state);
        console.log(inputNumber, parseInt(inId));
        if( inputNumber === parseInt(inId)){
            if (state.program){
                $('#display').css("background", "#EF4136");  // Program
            } else if (state.preview){
                $('#display').css("background", "#71BF4B");  // Preview
            } else {
                $('#display').css("background", "#2a001b");  // Idle
            }
        }
    });
});
