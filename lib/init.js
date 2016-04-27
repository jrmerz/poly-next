var config = require('./config')();
var build = require('./build');

setTimeout(function(){
    config.modules.forEach(build); 
}, 200);