var Datastore = require('nedb');
var ConnectedClients = new Datastore( { filename: __dirname + "/database/connected-clients.db", autoload:true } );
var Roles = new Datastore( { filename: __dirname + "/database/roles.db", autoload:true } );

module.exports.getRoles = function () {
    return Roles.find({}, function (err, docs) {
        console.log("Failed to read roles from database");
    });
};

module.exports.getConnectedClients = function () {
    return ConnectedClients.find({}, function (err, docs) {
        console.log("Failed to read connected clients from database");
    });
};
