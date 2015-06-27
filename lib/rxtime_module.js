var updateTimer;
var status;
var seconds;

module.exports = function(io) {
    io.on('connection', function(socket) {
        
        // Reset seconds to 0, set status to "On Air" , count time up and broadcast message
        socket.on('status on air reset', function(duration) {
            try {
                clearInterval(updateTimer);
            }
            catch (err){};
            seconds = 0;
            status = "on air";
            io.emit('live status', seconds++, status);
            
            updateTimer = setInterval(function() {
                io.emit('live status', seconds++, status);
            }, 1000);
        });
        
        // Set status to "off air", stop counter and stop broadcast
        socket.on('status off air', function(duration) {
            try {
                clearInterval(updateTimer);
                status = "off air";
                io.emit('live status', --seconds, status);                
            }
            catch (err){};
        });        
    });
}