var updateCountdown;

module.exports = function(io) {
    io.on('connection', function(socket) {
        socket.on('custom countdown', function(duration) {
            try {clearInterval(updateCountdown);}
            catch (err){};
            updateCountdown = setInterval(function() {
                console.log(duration);
                duration = duration - 0.01;
                if (duration < 0.01){
                    clearInterval(updateCountdown);
                }
                
                io.emit('countdown', duration);
            }, 10);
        });
    });
}