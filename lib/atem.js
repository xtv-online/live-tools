var Atem = require('atem');
var myAtem = new Atem();
var io;
var configurationDatabase = require('./configuration');

module.exports.initialise = function(newIO) {
    io = newIO;
};

module.exports.start = function() {
    configurationDatabase.getConfigEntry('Atem')

    .then(function(config) {
            myAtem.ip = config.value.ipAddress;
            myAtem.connect();
            console.log('ATEM Connection Listener:'.bold, myAtem.ip);

            myAtem.on('connectionStateChange', function(state) {
                console.log('Atem Connection State Has Changed'.green.bold, state.description);

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

            io.on('connection', function(socket) {
                socket.on('restart', function(component) {
                    if (component === 'Atem') {
                        myAtem.disconnect();
                        console.log('ATEM Connection Stopped'.bold.red);
                        exports.start();
                        socket.emit('restarting');
                    }
                });
            });

        })
        .catch(function(error) {
            console.error('Atem Configuration Error'.red.bold, error);
        });
};
