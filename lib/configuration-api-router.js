var express = require('express');
var router = express.Router();
var configurationDatabase = require('./configuration');
var colour = require('colour');

router.get('/', function(req, res, next) {
    configurationDatabase.getConfigEntries()
        .then(function(result) {
            res.send(result);
        });
});

router.get('/:name', function(req, res, next) {
    configurationDatabase.getConfigEntry(req.params.name)
        .then(function(result) {
            res.send(result);
        });
});

router.post('/:name', function(req, res) {
    var bodyStr = '';
    req.on("data", function(chunk) {
        bodyStr += chunk.toString();
    });
    req.on("end", function() {
        configurationDatabase.updateConfigEntry(req.params.name, JSON.parse(bodyStr))

        .then(function() {
            res.send(true);
            console.log('Config Updated: '.green.bold + req.params.name);
        })

        .catch(function (error) {
            res.send(false);
            console.error('Error Updating Record'.red.bold, error);
        });
    });
});

module.exports = router;
