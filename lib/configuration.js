var Datastore = require('nedb');
var Q = require('q');

// Attempt to connect to database tables, throw error if fails
try {
    var Configuration = new Datastore({
        filename: __dirname + '/database/configuration.config',
        autoload: true
    });
} catch (e) {
    console.error('Database Load Error'.red.bold, error);
}

module.exports.addConfigEntry = function(name, value) {
    var deferred = Q.defer();

    Configuration.insert({
        'name': name,
        'value': value
    }, function(error, newItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(newItem);
        }
    });

    return deferred.promise;
};

module.exports.updateConfigEntry = function(name, newValue) {
    var deferred = Q.defer();

    Configuration.update({
        'name': name
    }, {
        $set: {
            'value': newValue
        }
    }, {
        multi: false
    }, function(error, numberReplaced, updatedItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(updatedItem);
        }
    });

    return deferred.promise;
};

module.exports.getConfigEntry = function(name) {
    var deferred = Q.defer();

    Configuration.findOne({
        "name": name
    }, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

module.exports.getConfigEntries = function() {
    var deferred = Q.defer();

    Configuration.find({}, function(error, result) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};
