var database = require('./database');

module.exports = function(io) {
    io.on('connection', function(socket) {

        // message handling from non-director client
        //A1
        socket.on('tell director that client is not listening to director', function(roleId) {
            io.emit('director: client not listening', roleId);
        });
        //A2
        socket.on('tell director that client is listening to director', function(roleId) {
            io.emit('director: client listening', roleId);
        });
        //A3
        socket.on('tell director to listen to client', function(roleId) {
            io.emit('director: listen to client', roleId);
        });
        //A4
        socket.on('tell director to stop listening to client', function(roleId) {
            io.emit('director: stop listening to client', roleId);
        });


        // message handling from director clients
        //B1
        socket.on('tell client to listen to director', function(roleId) {
            io.emit('client: listen to director', roleId);
        });
        //B2
        socket.on('tell client to not listen to director', function(roleId) {
            io.emit('client: stop listening to director', roleId);
        });
        //B3
        socket.on('tell client that director is not listening', function(roleId) {
            io.emit('client: director not listening', roleId);
        });
        //B4
        socket.on('tell client that director is listening', function(roleId) {
            io.emit('client: director is listening', roleId);
        });
    });
};
