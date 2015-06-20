var io;
var database = require('./database');

module.exports.initialise = function(newIO) {
    io = newIO;
    database.clearConnectedClients();
};

module.exports.start = function() {

    // Handle new connections from a client and their disconnections
    io.on('connection', function(socket) {
        send_greeting(socket);
        socket.on('disconnect', function() {
            user_disconnected(socket);
        });
    });

    function send_greeting(socket) {
        database.getRoles(function (result) {
            io.sockets.connected[socket.id].emit("who are you", result);
            socket.on('i am', function (identity) {
                // database.getRoleByID(identity, function (result) {
                //     console.log(socket.id, "is", result.roleName);
                // });
                database.addClientToConnectedClients(identity, socket.id, function () {
                    database.getConnectedClientBySocketID(socket.id, function (result) {
                        console.log(result.role[0].roleName, "connected");
                        io.sockets.connected[socket.id].emit("you are", result);
                        io.emit("client connected", result);
                    });
                });
            });
        });
    }

    function user_disconnected(socket) {
        database.getConnectedClientBySocketID(socket.id, function (result) {
            console.log(result.role[0].roleName, "disconnected");
            io.emit("client disconnected", result);
            database.removeClientFromConnectedClients(socket.id, function() {

            });
        });
    }
};

module.exports.stop = function() {

};
