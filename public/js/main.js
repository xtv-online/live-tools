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
    var inId = parseInt(getURLParameter('in'));
    $('#cam span').text(inId);

    var socket = io();

    socket.on('camera tally', function(inputNumber, state){
        if (state.program){
            if (isNaN(inId)){
                $('#cam span').text(inputNumber);
            }
        }
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

    socket.on('timeofday', function(timestring){
        $('#timeofday span').text(timestring);
    });

    socket.on('cg countdown path', function(path){
        $('#note boxtitle p').text(path);
    });

    socket.on('cg countdown timeData', function(remainingTime, totalTime){

        var minutes = Math.floor(remainingTime / 60);
        var seconds = remainingTime - (minutes * 60);

        seconds = seconds.toFixed(2);

        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        $('#note span').text(minutes + ':' + seconds);
    });

    socket.on('atem connection', function (connected) {
        if (connected) {
            $('#alerts').text('');
        } else {
            $('#alerts').text('Connection to ATEM lost');
        }
    })

});
