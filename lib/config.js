var path = require('path');

var config = {
    root : __dirname+'/app',
    port : 8080,
    modules : [],
    browserify : {
        debug: true
    },
    babel : {
        presets : ['es2015', 'react']
    }
}

function processModulePaths() {
    config.modules.forEach((m) => {
        m.filepath = path.join(config.root, m.urlpath);
    });
}

if( process.argv.length > 2 ) {
    config.root = process.argv[2];
}

if( process.argv.length > 3 ) {
    config.modules.push({
        urlpath : process.argv[3]
    });
    
    processModulePaths();
}

module.exports = function(c) {
    if( c ) {
        for( var key in c ) {
            config[key] = c[key];
        }
        processModulePaths();
    }
    
    return config;
}