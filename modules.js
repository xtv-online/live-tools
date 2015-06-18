module.exports = function(http) {
    var io = require('socket.io')(http);

    var atem = require('./lib/atem')(io);
    var clock = require('./lib/timeofday')(io);
    var casparCountdown = require('./lib/caspar-countdown')(io);
}
