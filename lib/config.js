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
        m.urlpath = m.urlpath.replace(/^\//,'');
        m.filepath = path.join(config.root, m.urlpath);
    });
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