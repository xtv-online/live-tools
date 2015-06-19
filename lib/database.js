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
    Roles.find({}).sort({ "roleName" : 1 }).exec(function(err, docs) {
        callback(docs);
    });
};

module.exports.getConnectedClients = function(callback) {
    ConnectedClients.find({}, function(err, docs) {
        callback(docs);
    });
};

module.exports.clearConnectedClients = function() {
    ConnectedClients.remove({}, {multi: true}, function(err, numRemoved) {
        console.log('Purged connect clients collection');
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
            console.log(doc.roleName, 'has been added to the connected clients collection.');
            callback();
        });
    });
};

module.exports.removeClientFromConnectedClients = function(socketID, callback) {
    ConnectedClients.remove({ "socketID" : socketID }, {multi: false}, function(err, numRemoved) {
        console.log('Removed client on', socketID);

    });
};
