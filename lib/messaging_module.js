var database = require('./database');

module.exports = function(io) {
    io.on('connection', function(socket) {

        socket.on('messaging send message broadcast', function(message) {
            database.getConnectedClientBySocketID(socket.id)

            .then(function(sender) {
                var senderName = sender.role[0].roleName;

                io.emit('messaging message', JSON.stringify({
                    'source': senderName,
                    'message': message
                }));
            });

        });

        socket.on('messaging send message roleID', function(object) {
            var messageObject = JSON.parse(object);

            database.getConnectedClientsByRoleID(messageObject.roleID)

            .then(function(destinationClients) {
                return [destinationClients, database.getConnectedClientBySocketID(socket.id)];
            })

            .spread(function(destinationClients, sender) {
                var senderName = sender.role[0].roleName;

                destinationClients.forEach(function(client) {
                    console.log('Sending Message to', client.socketID);

                    io.sockets.connected[client.socketID].emit('messaging message', JSON.stringify({
                        'source': senderName,
                        'message': messageObject.message
                    }));
                });
            });

        });

        socket.on('messaging acknowledge', function() {
            database.getConnectedClientBySocketID(socket.id)

            .then(function(sender) {
                var senderName = sender.role[0].roleName;

                io.emit('messaging acknowledgement', senderName);
            });

        });

    });
};
