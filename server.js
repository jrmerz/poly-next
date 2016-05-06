var express = require('express');
var app = express();

module.exports = function(config) {
    var core = require('./lib/core');
    
    config = core.config(config);
    var middleware = core.middleware();

    app.use(middleware);
    app.use(express.static(config.root));

    app.listen(config.port);
    
    console.log(`\nServer now up @ http://localhost:${config.port}\n`);
}

