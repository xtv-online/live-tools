function customcountdown_module(timeSelector, titleSelector, countdownFunction) {

    socket.on('countdown', function(duration) {
        
        if (countdownFunction !== undefined) {
            countdownFunction(time);
        }

        $(titleSelector).text("Director's Countdown");
        
        
        (duration >0) ? minutes = Math.floor(duration / 60): minutes = Math.abs(Math.ceil(duration / 60));
        (duration >0) ? seconds = duration - (minutes * 60): seconds = Math.abs(duration + (minutes * 60));
        
        seconds = seconds.toFixed(2);

        minutes = ((minutes < 10 && minutes >= 0) ? "0" : "") + minutes;
        if (duration < 0) {minutes = "-" + minutes}
        seconds = ((seconds < 10 && seconds >= 0) ? "0" : "") + seconds;

        $(timeSelector).text(minutes + ':' + seconds);
    });

}
