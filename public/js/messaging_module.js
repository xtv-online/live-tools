 function messaging_module_initialise(messageReceivedFunction, acknowledgementFunction) {
     socket.on('messaging message', function(object) {
         var messageObject = JSON.parse(object);
         messageReceivedFunction(messageObject.message, messageObject.source);
     });

     socket.on('messaging acknowledgement', function(senderName) {
         acknowledgementFunction(senderName);
     });
 }

 function messaging_module_broadcastMessage(message) {
     socket.emit('messaging send message broadcast', message);
 }

 function messaging_module_sendMessage(message, roleID) {
     var messageObject = {
         'roleID': roleID,
         'message': message
     };

     socket.emit('messaging send message roleID', JSON.stringify(messageObject));
 }

 function messaging_module_acknowledge() {
     socket.emit('messaging acknowledge');
 }
