var express = require('express');
var app = express();

module.exports = function(config) {
    config = require('./lib/config')(config);
    var middleware = require('./lib/middleware')();

    app.use(middleware);
    app.use(express.static(config.root));

    app.listen(config.port);
    
    console.log(`\nServer now up @ http://localhost:${config.port}\n`);
}

