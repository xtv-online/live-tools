var casparcountdownActive = false;

function casparcountdown_module(timeSelector, pathSelector, countdownFunction) {

    socket.on('cg countdown path', function(path) {
        if(casparcountdownActive){
            $(pathSelector).text(path);
        }
    });

    socket.on('cg countdown timeData', function(time, totalTime) {
        
        if (countdownFunction !== undefined) {
            countdownFunction(time);
        }
        if(casparcountdownActive){
            var minutes = Math.floor(time / 60);
            var seconds = time - (minutes * 60);

            seconds = seconds.toFixed(2);

            minutes = (minutes < 10 ? "0" : "") + minutes;
            seconds = (seconds < 10 ? "0" : "") + seconds;

            $(timeSelector).text(minutes + ':' + seconds);
        }
    });
    
    socket.on('custom active', function(customActive) {
        casparcountdownActive = !customActive;
    });
}
