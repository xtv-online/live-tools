module.exports = function(io) {
    setInterval(function(){

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        io.emit('timeofday', hour + ":" + min + ":" + sec);
    }, 500);
}
