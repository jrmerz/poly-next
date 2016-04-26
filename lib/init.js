var config = require('./config')();
var build = require('./build');

config.modules.forEach(build);