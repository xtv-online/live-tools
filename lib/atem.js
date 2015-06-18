module.exports = function(io){
    var Atem = require('atem');
    var myAtem = new Atem();
    myAtem.ip = '192.168.0.10';
    myAtem.connect();

    myAtem.on('connectionStateChange', function(state) {
        console.log('Atem State', state);
    });

    myAtem.on('connectionLost', function() {
        console.log('Atem connection lost!');
    });

    myAtem.on('inputTally', function(inputNumber, state){
        io.emit('camera tally', inputNumber, state);

    });
}
