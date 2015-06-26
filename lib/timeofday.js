module.exports = function(io) {
    setInterval(function() {
        var date = new Date();
        io.emit('timeofday', date);
    }, 500);
};