var express = require('express');
var app = express();

var config = require('./lib/config')();
var middleware = require('./lib/middleware')();

app.use(middleware);
app.use(express.static(config.root));

app.listen(config.port);