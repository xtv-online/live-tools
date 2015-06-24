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
        'name' : name,
        'value' : value
    }, function(error, newItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(newItem);
        }
    });

    return deferred.promise;
};

module.exports.addConfigEntry = function(name, value) {
    var deferred = Q.defer();

    Configuration.insert({
        'name' : name,
        'value' : value
    }, function(error, newItem) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(newItem);
        }
    });

    return deferred.promise;
};

module.exports.atemConfiguration = function() {
    var configuration = {
        'address': '192.168.0.10'
    };

    return configuration;
};

module.exports.casparConfiguration = function() {
    var configuration = {
        'port': '9000',
        'channel': '1',
        'layer': '10'
    };

    return configuration;
};
