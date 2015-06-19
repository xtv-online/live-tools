var io;

module.exports.initialise = function (newIO) {
    io = newIO;
};

module.exports.start = function () {

    // Handle new connections from a client and their disconnections
    io.on('connection', function (socket) {
        console.log('New Connection', socket.id);
        socket.on('disconnect', function () {
            console.log('Connection Lost', socket.id);
        });
    });
};

module.exports.stop = function () {

};
