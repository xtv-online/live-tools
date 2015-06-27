$(function() {

    handshaking_module(ready);

    function ready() {

        // Set up time of day
        timeofday_module('', updateClock);

        // Setup Caspar Countdown Module
        casparcountdown_module('#countdown', '#countdownTitle span');

        // Setup Custom Countdown
        customcountdown_module('#countdown', '#countdownTitle span');

        // Setup RX time display
        txtime_module('#timeTX', '#livestatus span', '#livestatus');

    }

});



function updateClock(timeString) {
    var date = new Date(timeString);

    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();

    // update text
    $("#hm").text(((hours < 10) ? "0" + hours : hours) + ":" + ((minutes < 10) ? "0" + minutes : minutes));
    $("#s").text(((seconds < 10) ? "0" + seconds : seconds));

    // light up seconds
    for (i = 0; i < (seconds + 1); i++) {
        $(".p" + i).css("background", "#EF4136");
    }
    // clear remaining seconds
    for (i = (seconds + 1); i < 60; i++) {
        $(".p" + i).css("background", "gray");
    }
}
