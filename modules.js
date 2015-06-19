module.exports = function(http) {
    var io = require('socket.io')(http);

    var clientManager = require('./lib/client-manager');
    clientManager.initialise(io);
    clientManager.start();

    var atem = require('./lib/atem');
    atem.initialise(io);
    atem.start();

    var clock = require('./lib/timeofday')(io);

    var casparCountdown = require('./lib/caspar-countdown');
    casparCountdown.initialise(io);
    casparCountdown.start();

};
