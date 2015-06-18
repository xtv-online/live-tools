module.exports = function(http){
    var atem = require('./lib/atem')(http);
    var clock = require('./lib/timeofday')(http);
}
