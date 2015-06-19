var Datastore = require('nedb');


try {
    console.log(__dirname);
    var ConnectedClients = new Datastore( { filename: __dirname + "/database/connected-clients.db", autoload:true } );
    var Roles = new Datastore( { filename: __dirname + "/database/roles.db", autoload:true } );
} catch (e) {
    console.log('Database load error', e);
}

module.exports.getRoles = function(callback) {
    Roles.find({}, function (err, docs) {
        callback(docs);
    });
};

module.exports.getConnectedClients = function() {
    ConnectedClients.find({}, function (err, docs) {
        return docs;
    });
};
