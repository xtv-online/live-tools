var express = require('express');
var router = express.Router();
var database = require('./database');
var colour = require('colour');

// Get All Roles
router.get('/', function(req, res, next) {
    database.getRoles()
        .then(function(result) {
            res.send(result);
        });
});

// Add New Role
router.put('/', function(req, res) {
    var bodyStr = '';
    req.on("data", function(chunk) {
        bodyStr += chunk.toString();
    });
    req.on("end", function() {
        res.send(JSON.parse(bodyStr));
        // database.addRole(JSON.parse(bodyStr))
        //
        // .then(function(newRole) {
        //     res.send(true);
        //     console.log('New Role Created: '.green.bold + newRole.name);
        // })
        //
        // .catch(function (error) {
        //     res.send(false);
        //     console.error('Error Creating New Role'.red.bold, error);
        // });
    });
});

// Update Role
router.post('/:id', function(req, res) {
    var bodyStr = '';
    req.on("data", function(chunk) {
        bodyStr += chunk.toString();
    });
    req.on("end", function() {
        res.send(JSON.parse(bodyStr));
        // configurationDatabase.updateConfigEntry(req.params.name, JSON.parse(bodyStr))
        //
        // .then(function() {
        //     res.send(true);
        //     console.log('Config Updated: '.green.bold + req.params.name);
        // })
        //
        // .catch(function (error) {
        //     res.send(false);
        //     console.error('Error Updating Record'.red.bold, error);
        // });
    });
});

// Delete Role
router.delete('/:id', function (req, res) {
    database.deleteRole(req.params.id)

    .then(function (success) {
        res.send(true);
    })

    .catch(function (error) {
        res.send(false);
        console.error('Error Removing Record'.red.bold, error);
    });
});

module.exports = router;
