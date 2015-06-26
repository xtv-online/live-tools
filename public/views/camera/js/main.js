/* NEED:
  * function to send data to director
  * event to parse incoming data from director/tally/Caspar
  * get role of this client

  TO-DO:
  * function setTally()
  * function muteTx()
  * function forceRX() to force director to listen to this client
*/

// OLD CODE FROM PoC:
$(function() {

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

    }

    $('#livestatus').textfill({});
    //
    // var inId = parseInt(getURLParameter('in'));
    // $('#tally span').text(inId);
    //
    // var socket = io();
    //
    // socket.on('camera tally', function(inputNumber, state) {
    //     if (state.program) {
    //         if (isNaN(inId)) {
    //             $('#cam span').text(inputNumber);
    //         }
    //     }
    //     if (inputNumber === parseInt(inId)) {
    //         if (state.program) {
    //             $('#display').css("background", "#EF4136"); // Program
    //
    //         } else if (state.preview) {
    //             $('#display').css("background", "#71BF4B"); // Preview
    //         } else {
    //             $('#display').css("background", "#2a001b"); // Idle
    //         }
    //     }
    // });
    //
    // socket.on('timeofday', function(timestring) {
    //     $('#timeofday span').text(timestring);
    // });
    //
    // socket.on('cg countdown path', function(path) {
    //     $('#note boxtitle p').text(path);
    // });
    //
    // socket.on('cg countdown timeData', function(remainingTime, totalTime) {
    //
    //     var minutes = Math.floor(remainingTime / 60);
    //     var seconds = remainingTime - (minutes * 60);
    //
    //     seconds = seconds.toFixed(2);
    //
    //     minutes = (minutes < 10 ? "0" : "") + minutes;
    //     seconds = (seconds < 10 ? "0" : "") + seconds;
    //
    //     $('#note span').text(minutes + ':' + seconds);
    // });
    //
    // socket.on('atem connection', function(connected) {
    //     if (connected) {
    //         $('#alerts').text('');
    //     } else {
    //         $('#alerts').text('Connection to ATEM lost');
    //     }
    // })

});
