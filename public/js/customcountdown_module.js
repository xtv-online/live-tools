function customcountdown_module(timeSelector, titleSelector, countdownFunction) {

    socket.on('countdown', function(duration) {
        
        if (countdownFunction !== undefined) {
            countdownFunction(time);
        }

        $(titleSelector).text("Director's Countdown");
        
        var minutes = Math.floor(duration / 60);
        var seconds = duration - (minutes * 60);

        seconds = seconds.toFixed(2);

        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        $(timeSelector).text(minutes + ':' + seconds);
    });

}
