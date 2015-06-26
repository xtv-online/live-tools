function casparcountdown_module(timeSelector, pathSelector, countdownFunction) {

    socket.on('cg countdown path', function(path) {
        $(pathSelector).text(path);
    });

    socket.on('cg countdown timeData', function(time, totalTime) {

        if (countdownFunction !== undefined) {
            countdownFunction(time);
        }

        var minutes = Math.floor(remainingTime / 60);
        var seconds = remainingTime - (minutes * 60);

        seconds = seconds.toFixed(2);

        minutes = (minutes < 10 ? "0" : "") + minutes;
        seconds = (seconds < 10 ? "0" : "") + seconds;

        $(timeSelector).text(minutes + ':' + seconds);
    });

}
