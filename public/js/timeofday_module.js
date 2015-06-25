function timeofday_module(clockSelector, timeFunction) {

    socket.on('timeofday', function(newDate) {
        var date = new Date(newDate);

        if (timeFunction !== undefined) {
            timeFunction(date);
        }

        if (clockSelector) {
            var hour = date.getHours();
            hour = (hour < 10 ? "0" : "") + hour;

            var min = date.getMinutes();
            min = (min < 10 ? "0" : "") + min;

            var sec = date.getSeconds();
            sec = (sec < 10 ? "0" : "") + sec;

            $(clockSelector).text(hour + ":" + min + ":" + sec);
        }
    });

}
