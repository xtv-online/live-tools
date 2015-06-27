function customcountdown_module(timeSelector, titleSelector, alwaysActive, countdownFunction) {
    alwaysActive = typeof alwaysActive !== 'undefined' ? alwaysActive : false;
    
    socket.on('countdown', function(data) {
        if (countdownFunction !== undefined) {
            countdownFunction(time);
        }
        casparcountdownActive = !data.customActive;
        
        if (data.customActive && !alwaysActive) {
            $(titleSelector).text("Director's Countdown");
            
            
            (data.duration >0) ? minutes = Math.floor(data.duration / 60): minutes = Math.abs(Math.ceil(data.duration / 60));
            (data.duration >0) ? seconds = data.duration - (minutes * 60): seconds = Math.abs(data.duration + (minutes * 60));
            
            seconds = seconds.toFixed(2);

            minutes = ((minutes < 10 && minutes >= 0) ? "0" : "") + minutes;
            if (data.duration < 0) {minutes = "-" + minutes}
            seconds = ((seconds < 10 && seconds >= 0) ? "0" : "") + seconds;

            $(timeSelector).text(minutes + ':' + seconds);
        }
    });
}
