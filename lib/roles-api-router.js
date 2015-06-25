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
router.post('/addRole/', function(req, res) {
    var bodyStr = '';
    req.on("data", function(chunk) {
        bodyStr += chunk.toString();
    });
    req.on("end", function() {
        res.send(JSON.parse(bodyStr));
        database.addRole(JSON.parse(bodyStr))

        .then(function(newRole) {
            res.send(true);
            console.log('New Role Created: '.green.bold + newRole.roleName);
        })

        .catch(function (error) {
            res.send(false);
            console.error('Error Creating New Role'.red.bold, error);
        });
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
        database.updateRole(req.params.id, JSON.parse(bodyStr))

        .then(function(newData) {
            console.log('Role Updated: '.green.bold + newData.roleName);
            res.send(true);
        })

        .catch(function (error) {
            console.error('Error Updating Record'.red.bold, error);
            res.send(false);
        });
    });
});

// Delete Role
router.post('/deleteRole/:id', function (req, res) {
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
