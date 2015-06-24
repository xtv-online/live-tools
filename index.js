// Create App, HTTP, ATEM and io
var express = require('express');
var logger = require('morgan');
var path = require('path');
var colour = require('colour');
var fs = require('fs');

var app = express();
var http = require('http').Server(app);
var PORT = 3000;

// Log all requests in server output
app.use(logger('dev'));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

// Static route for static requests
app.use(express.static(path.join(__dirname, 'public')));

var configurationAPIRouter = require('./lib/configuration-api-router');
app.use('/config/api', configurationAPIRouter);

// Route for /
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/handshake.html');
});

// Set server to listen
http.listen(PORT, function() {
    console.log('HTTP Server Listener Started:'.bold, PORT);
});

// Run all modules defined in modules.js
var modules = require('./modules')(http);

process.on('SIGINT', function() {
    fs.unlink(__dirname + '/lib/database/connected-clients.db', function(err) {
        if (err) throw err;
        console.log('Deleted'.red.bold, __dirname + '/lib/database/connected-clients.db');
        process.exit();
    });
});
