module.exports = function(io) {

    var configuration = require('./configuration').casparConfiguration();

    var CHANNEL = configuration.channel;
    var LAYER = configuration.layer;
    var PORT = configuration.port;

    var osc = require('osc-min');
    var udp = require('dgram');

    console.log("CasparCG OSC listener: " + PORT);

    // Create socket and what to do when a message is recieved

    var sock = udp.createSocket("udp4", function(msg, rinfo) {
        try {
            var message = osc.fromBuffer(msg); // Message from buffer (A bundle containing many elements)

            if (message.oscType === "bundle") {

                message.elements.forEach(function(entry) {

                    if (entry.address.indexOf("/channel/" + CHANNEL) != -1 && entry.address.indexOf("/stage/layer/" + LAYER) != -1 && entry.address.indexOf("/file") != -1) {
                        if (entry.address.indexOf("/path") != -1) {
                            sendPathData(entry.args[0].value);
                        }
                        if (entry.address.indexOf("/time") != -1) {
                            var remainingTime = entry.args[1].value - entry.args[0].value;
                            sendTimeData(remainingTime, entry.args[1].value);
                        }
                    }
                });
            }
        } catch (_error) {
            return console.log(_error);
        }
    });

    sock.bind(PORT);

    function sendTimeData(remainingTime, totalTime) {
        //console.log(remainingTime, '/', totalTime);
        io.emit('cg countdown timeData', remainingTime, totalTime);
    }

    function sendPathData(path) {
        //console.log('Currently playing file: ', path);
        io.emit('cg countdown path', path);
    }
}
