var Atem = require('atem');
var myAtem = new Atem();

module.exports.start = function(io) {
    var configuration = require('./configuration').atemConfiguration();

    myAtem.ip = configuration.address;
    myAtem.connect();

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
