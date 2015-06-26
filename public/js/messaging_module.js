var messaging_module = function() {

    this.initialise = function(messageReceivedFunction, acknowledgementFunction) {
        socket.on('messaging message', function(object) {
            var messageObject = JSON.parse(object);
            messageReceivedFunction(messageObject.message, messageObject.source);
        });

        socket.on('messaging acknowledgement', function(senderName) {
            acknowledgementFunction(senderName);
        });
    };

    this.broadcastMessage = function(message) {
        socket.emit('messaging send message broadcast', message);
    };

    this.sendMessage = function(message, roleID) {
        var messageObject = {
            'roleID': roleID,
            'message': message
        };

        socket.emit('messaging send message roleID', JSON.stringify(messageObject));
    };

    this.acknowledge = function() {
        socket.emit('messaging acknowledge');
    };

};
