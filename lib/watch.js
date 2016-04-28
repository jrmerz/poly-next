var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var files = {};

var api = {
    set : function(module, file) {
        if( !files[file] ) {
            files[file] = [module];
            fs.watchFile(file, (curr, prev) => {
                if( curr.mtime && prev.mtime && curr.mtime.getTime() === prev.mtime.getTime() ) {
                    return;
                }
                fireRebuild(file);
            });
        } else if ( files[file].indexOf(module) === -1 ) {
            files[file].push(module);
        }
    },
    on : function(e, fn) {
        ee.on(e, fn);
    }
}

function fireRebuild(file) {
    files[file].forEach((module) => {
       ee.emit('rebuild', {
           changedModule: module,
           file : file
        }); 
    });
}

module.exports = api;