var express = require('express');
var router = express.Router();
var clientDatabase = require('./database');
var colour = require('colour');

router.get('/', function(req, res, next) {
    clientDatabase.getEachRoleWithConnectedClients()

    .then(function (roles) {
        res.send(roles);
    });
});

module.exports = router;
