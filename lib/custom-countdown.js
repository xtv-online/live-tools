var updateCountdown;
var active = false;
var data = new Object();
data.duration = 0;
data.customActive = true;

module.exports = function(io) {
    
    io.on('connection', function(socket) {
        socket.on('custom countdown 1m', function() {
            if (data.customActive){
                data.duration = data.duration + 60;
                io.emit('countdown', data);
            }
        });
        
        socket.on('custom countdown 10s', function() {
            if (data.customActive){
                data.duration = data.duration + 10;
                io.emit('countdown', data);
            }
        });
        
        socket.on('reset custom countdown', function() {
            if (data.customActive){
                try {
                    clearInterval(updateCountdown);
                }
                catch (err){};
                data.duration = 0

                io.emit('countdown', data);
            }
        });
        
        socket.on('toggle custom countdown', function() {
            if (data.customActive){
                try {
                    clearInterval(updateCountdown);
                }
                catch (err){};
                
                if (active) {
                    io.emit('countdown', data);
                    active = false;
                } else {
                    startCountdown();
                    active = true;
                } 
            }
        });
        
        socket.on('toggle countdowns', function() {
            data.customActive ? data.customActive = false : data.customActive = true;
            io.emit('custom active', data.customActive);
            io.emit('countdown', data);
        });
    });

    function startCountdown(){
        try {clearInterval(updateCountdown);}
        catch (err){};
        updateCountdown = setInterval(function() {
            data.duration = data.duration - 0.04;        
            io.emit('countdown', data);
        }, 40);
};
}

