var Datastore = require('nedb');

// Attempt to connect to database tables, throw error if fails
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

// **********************************************
// ****************** Roles *********************
// **********************************************

module.exports.getRoles = function(callback) {
    Roles.find({}).sort({
        "roleName": 1
    }).exec(function(err, docs) {
        if (docs !== null) {
            callback(docs);
        }
    });
};

module.exports.getRoleByID = function(roleID, callback) {
    Roles.findOne({ "_id" : roleID }, function(err, doc) {
        if (doc !== null) {
            callback(doc);
        }
    });
};

// **********************************************
// ************* Connected Clients **************
// **********************************************

module.exports.getConnectedClients = function(callback) {
    ConnectedClients.find({}, function(err, docs) {
        if (docs !== null) {
            callback(docs);
        }
    });
};

module.exports.clearConnectedClients = function() {
    ConnectedClients.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        console.log('Purged connect clients collection');
    });
};

module.exports.getConnectedClientByRoleID = function(roleID, callback) {
    ConnectedClients.findOne({
        "role._id": roleID
    }, function(err, doc) {
        if (doc !== null) {
            callback(doc);
        }
    });
};

module.exports.getConnectedClientBySocketID = function(socketID, callback) {
    ConnectedClients.findOne({
        "socketID": socketID
    }, function(err, doc) {
        if (doc !== null) {
            callback(doc);
        }
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
            // console.log('Client has been added to the connected clients collection.');
            callback();
        });
    });
};

module.exports.removeClientFromConnectedClients = function(socketID, callback) {
    ConnectedClients.remove({
        "socketID": socketID
    }, {
        multi: false
    }, function(err, numRemoved) {
        callback();
    });
};
