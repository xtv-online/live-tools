var io;
var database = require('./database');

module.exports.initialise = function(newIO) {
    io = newIO;
};

module.exports.start = function() {

    // Handle new connections from a client and their disconnections
    io.on('connection', function(socket) {
        console.log('New Connection', socket.id);
        send_greeting(socket);

        socket.on('disconnect', function() {
            console.log('Connection Lost', socket.id);
            user_disconnected(socket);
        });
    });

    function send_greeting(socket) {
        database.getRoles(function (result) {
            io.sockets.connected[socket.id].emit("who are you", result);
            socket.on('i am', function (identity) {
                console.log(identity);
            });
        });
    }

    function user_disconnected(socket) {
        console.log('disconnected fired');
    }
};

module.exports.stop = function() {

};
