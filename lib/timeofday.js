module.exports = function(server){
    var io = require('socket.io')(server);
    var Clock = require('clockmaker').Timer;

    Clock(function(timer) {

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        io.emit('timeofday', hour + ":" + min + ":" + sec);
    }, 500, {
      repeat: true
    }).start();
}
