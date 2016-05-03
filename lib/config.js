var path = require('path');
var babelPresetEs2015 = require('babel-preset-es2015');
var babelPresetReact= require('babel-preset-react');

var config = {
    root : path.join(process.cwd(), 'app'),
    port : 8080,
    modules : [],
    browserify : {
        debug: true
    },
    typescript : false, // use typescript compile
    tsify : { 
        target: 'es6',
        emitDecoratorMetadata : true,
        removeComments : false,
        noImplicitAny : true,
        experimentalDecorators : true,
    },
    babel : {
        presets : [babelPresetEs2015, babelPresetReact],
        extensions: ['.js', '.ts', '.jsx', '.tsx' ]
    }
}

function processModulePaths() {
    config.modules.forEach((m) => {
        m.urlpath = m.urlpath.replace(/^\//,'');
        m.filepath = path.join(config.root, m.urlpath);
        m.name = m.name || '_dev_index';
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