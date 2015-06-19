var Datastore = require('nedb');


try {
    var ConnectedClients = new Datastore({
        filename: __dirname + "/database/connected-clients.db",
        autoload: true
    });
    var Roles = new Datastore({
        filename: __dirname + "/database/roles.db",
        autoload: true
    });
} catch (e) {
    console.log('Database load error', e);
}

module.exports.getRoles = function(callback) {
    Roles.find({}, function(err, docs) {
        callback(docs);
    });
};

module.exports.getConnectedClients = function(callback) {
    ConnectedClients.find({}, function(err, docs) {
        callback(docs);
    });
};

module.exports.addClientToConnectedClients = function(roleID, socketID, callback) {
    Roles.find({
        "_id": roleID
    }, function(err, doc) {
        ConnectedClients.insert({
            "socketID": socketID,
            "role": doc
        }, function(err) {
            callback();
        });
    });
};
