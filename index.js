var path = require('path');
var logger = require('morgan');
var http = require('http');

var port = process.env.PORT || 3000;

var express = require('express');
var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(port, function() {
    console.log('Listening on:', port)
});

var modules = require('./modules')(server);
