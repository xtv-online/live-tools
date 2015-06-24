var express = require('express');
var router = express.Router();
var clientDatabase = require('./database');
var colour = require('colour');

router.get('/', function(req, res, next) {
    clientDatabase.getConnectedClients()
        .then(function(result) {
            res.send(result);
        });
});

router.get('/:name', function(req, res, next) {
    clientDatabase.getConnectedClientBySocketID(req.params.name)
        .then(function(result) {
            res.send(result);
        });
});

module.exports = router;
