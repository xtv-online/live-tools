var database = require('./database');

module.exports = function(io) {
    io.on('connection', function(socket) {

        socket.on('messaging send message broadcast', function(message) {
            var sender = database.getConnectedClientBySocketID(socket.id);
            var senderName = sender.role[0].roleName;

            io.emit('messaging message', JSON.stringify({
                'source': senderName,
                'message': message
            }));
        });

        socket.on('messaging send message roleID', function(object) {
            var messageObject = JSON.parse(object);
            var destinationClients = database.getConnectedClientsByRoleID(messageObject.roleID);
            var sender = database.getConnectedClientBySocketID(socket.id);
            var senderName = sender.role[0].roleName;

            destinationClients.forEach(function(client) {
                console.log('Sending Message to', client.socketID);

                io.sockets.connected[client.socketID].emit('messaging message', JSON.stringify({
                    'source': senderName,
                    'message': messageObject.message
                }));
            });
        });

        socket.on('messaging acknowledge', function() {
            var sender = database.getConnectedClientBySocketID(socket.id);
            var senderName = sender.role[0].roleName;

            io.emit('messaging acknowledgement', senderName);
        });

    });
};
