var Atem = require('atem');
var myAtem = new Atem();
var io;

module.exports.initialise = function (newIO) {
    io = newIO;
};

module.exports.start = function() {
    var configuration = require('./configuration').atemConfiguration();

    myAtem.ip = configuration.address;
    myAtem.connect();
    console.log('ATEM Connection Listener:'.bold, myAtem.ip);

    myAtem.on('connectionStateChange', function(state) {
        console.log('Atem State', state);

        if (state.description === 'connected') {
            io.emit('atem connection', true);
        }

    });

    myAtem.on('connectionLost', function() {
        console.log('Atem connection lost!');
        io.emit('atem connection', false);
    });

    myAtem.on('inputTally', function(inputNumber, state) {
        io.emit('camera tally', inputNumber, state);
    });
};

module.exports.stop = function () {
    myAtem.disconnect();
};
