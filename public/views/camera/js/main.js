/* NEED:
  * function to send data to director
  * event to parse incoming data from director/tally/Caspar
  * get role of this client

  TO-DO:
  * function setTally()
  * function muteTx()
  * function forceRX() to force director to listen to this client
*/

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

        // Setup Custom Countdown
        customcountdown_module('#countdown span', '#countdownTitle span');

        // Setup Messaging Module
        messaging_module_initialise(newMessage);

        // Setup TX time display
        txtime_module('', '', '', liveStatusTrigger);

    }

    $('div#messageDisplay .acknowledge').hide();

    function newMessage(message, sender) {
        $('div#messageDisplay .title').text(sender);
        $('div#messageDisplay .message').text(message);

        $('div#messageDisplay .title').show();
        $('div#messageDisplay .message').show();
        $('div#messageDisplay .acknowledge').show();

        var ack = setInterval(function () {
            $('div#messageDisplay .acknowledge').fadeToggle(800);
        }, 800);

        $('div#messageDisplay').on('click', function () {
            messaging_module_acknowledge();
            $('div#messageDisplay .title').hide(400);
            $('div#messageDisplay .message').hide(400);
            $('div#messageDisplay .acknowledge').hide(400);
            clearInterval(ack);
        });
    }

    $('#liveSymbol').hide();

    function liveStatusTrigger(isLive) {
        if (isLive) {
            $('#liveSymbol').show(400);
        } else {
            $('#liveSymbol').hide(400);
        }
    }
});
