// Create App, HTTP, ATEM and io
var express = require('express');
var logger = require('morgan');
var path = require('path');

var app = express();
var http = require('http').Server(app);

// Log all requests in server output
app.use(logger('dev'));

// Static route for static requests
app.use(express.static(path.join(__dirname, 'public')));

// Route for /
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/template.html');
    console.log('request response');
});

// Set server to listen
http.listen(3000, function() {
    console.log('listening on *:3000');
});

// Run all modules defined in modules.js
var modules = require('./modules')(http);
