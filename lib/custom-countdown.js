var updateCountdown;

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('custom countdown', function(duration) {
            try {clearInterval(updateCountdown);}
            catch (err){};
            updateCountdown = setInterval(function() {
                
                duration = duration - 0.04;
               // to stop:
               // clearInterval(updateCountdown);
                
                io.emit('countdown', duration);
            }, 40);
        });
        socket.on('stop custom countdown', function(duration) {
            try {clearInterval(updateCountdown);}
            catch (err){};
        });
    });
}