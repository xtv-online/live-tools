var Datastore = require('nedb');
var Q = require('q');

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
} catch (error) {
    console.error('Database Load Error'.red.bold, error);
}

// **********************************************
// ****************** Roles *********************
// **********************************************

module.exports.getRoles = function() {
    var deferred = Q.defer();

    Roles.find({}).sort({
        "roleName": 1
    }).exec(function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

module.exports.getRoleByID = function(roleID) {
    var deferred = Q.defer();

    Roles.findOne({
        "_id": roleID
    }, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

module.exports.roleExistsByID = function(roleID) {
    var deferred = Q.defer();

    Roles.findOne({
        "_id": roleID
    }, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            if (result !== null) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }
        }
    });

    return deferred.promise;
};

module.exports.addRole = function(data) {
    var deferred = Q.defer();

    Roles.insert(data, function(error, newItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(newItem);
        }
    });

    return deferred.promise;
};

module.exports.updateRole = function(id, newData) {
    var deferred = Q.defer();

    Roles.update({
        '_id': id
    }, {
        $set: newData
    }, {
        multi: false
    }, function(error, numberReplaced, updatedItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};

module.exports.deleteRole = function(id) {
    var deferred = Q.defer();

    Roles.remove({
        "_id": id
    }, {
        multi: false
    }, function(error, numRemoved) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(numRemoved);
        }
    });

    return deferred.promise;
};

// **********************************************
// ************* Connected Clients **************
// **********************************************

// Getters


module.exports.getConnectedClients = function() {
    var deferred = Q.defer();

    ConnectedClients.find({}, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};


module.exports.getConnectedClientsByRoleID = function(roleID) {
    var deferred = Q.defer();

    ConnectedClients.find({
        "role._id": roleID
    }, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};


module.exports.getConnectedClients = function() {
    var deferred = Q.defer();

    ConnectedClients.find({}, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
            console.log(result);
        }
    });

    return deferred.promise;
};


module.exports.getConnectedClientBySocketID = function(socketID) {
    var deferred = Q.defer();

    ConnectedClients.findOne({
        "socketID": socketID
    }, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

// Adders

module.exports.addClientToConnectedClients = function(identity, socketID) {
    var deferred = Q.defer();

    var roleID = identity.roleID;
    var webRTC = identity.isWebRtcCapable;

    Roles.find({
        "_id": roleID
    }, function(error, result) {
        // if (error) {
        //     deferred.reject(new Error(error));
        // } else {
        ConnectedClients.insert({
            "socketID": socketID,
            "isWebRtcCapable": webRTC,
            "role": result
        }, function(error, newItem) {
            if (error) {
                deferred.reject(new Error(error));
            } else {
                deferred.resolve(newItem);
            }
        });
        // }
    });

    return deferred.promise;
};

// Removers

module.exports.clearConnectedClients = function() {
    var deferred = Q.defer();

    ConnectedClients.remove({}, {
        multi: true
    }, function(error, numRemoved) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(numRemoved);
        }
    });

    return deferred.promise;
};


module.exports.removeClientFromConnectedClientsBySocketID = function(socketID) {
    var deferred = Q.defer();

    ConnectedClients.remove({
        "socketID": socketID
    }, {
        multi: false
    }, function(error, numRemoved) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(numRemoved);
        }
    });

    return deferred.promise;
};
