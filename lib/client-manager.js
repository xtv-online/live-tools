var io;
var database = require('./database');

module.exports.initialise = function(newIO) {
    io = newIO;
};

module.exports.start = function() {

    // Handle new connections from a client and their disconnections
    io.on('connection', function(socket) {
        send_greeting(socket);
        socket.on('disconnect', function() {
            user_disconnected(socket);
        });
        socket.on('reset all clients', function () {
            io.emit('reset all');
            console.log('Reseting all connected clients'.bold.red);
        });
    });

    function send_greeting(socket) {
        database.getRoles()

        .then(function(result) {
            return result;
        })

        .then(function(result) {
            io.sockets.connected[socket.id].emit('who are you', result);
            socket.on('i am', function(identity) {

                // Check Role Exists if it doesn't throw an error otherwise continue
                database.roleExistsByID(identity.roleID)

                .then(function(exists) {
                    if (!exists) {
                        console.error(socket.id.bold.red, 'connected with invalid identity'.bold.red);
                        io.sockets.connected[socket.id].emit('invalid identity');
                        throw new Error();
                    } else {
                        return;
                    }
                })

                .then(function () {
                    return database.getConnectedClientBySocketID(socket.id);
                })

                .then(function (result) {
                    if (result !== null) {
                        console.log('Client Disconnected: '.red + result.role[0].roleName);
                        io.emit('client disconnected', result);
                        return database.removeClientFromConnectedClientsBySocketID(socket.id);
                    }
                })

                .then(function(number) {
                    if (number === 1) {
                        database.getConnectedClientBySocketID(socket.id)

                        .then(function(result) {
                            console.log('Client Disconnected: '.red + connectedClient.role[0].roleName);
                            io.emit('client disconnected', result);
                        });
                    }
                })


                // Add client to database table
                .then(function(result) {
                    return database.addClientToConnectedClients(identity, socket.id);
                })

                .then(function(result) {
                    console.log('Client Connected: '.green + result.role[0].roleName);
                    io.sockets.connected[socket.id].emit('you are', result);
                    io.emit('client connected', result);
                })

                .catch(function(error) {
                    throw new Error();
                });
            });
        })

        .catch(function(error) {
            console.log('Client Greeting Error'.red.bold, error);
        });
    }

    function user_disconnected(socket) {
        database.getConnectedClientBySocketID(socket.id)

        .then(function(connectedClient) {
            console.log('Client Disconnected: '.red + connectedClient.role[0].roleName);
            io.emit('client disconnected', connectedClient);
        })

        .then(function() {
            database.removeClientFromConnectedClientsBySocketID(socket.id);
        })

        .catch(function(error) {
            // console.log('Client Disconnect Error'.red.bold, error);
        });
    }
};
