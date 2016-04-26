var walk = require('walk');
var path = require('path');

var config = require('./config')();
var browserify = require('browserify');
var moduleStore = require('./moduleStore');
var watch = require('./watch');

module.exports = function(module) {
    
    var count = 0;

    console.log(`Walking and Watching: ${module.filepath}\n`);
    
    watch.on('rebuild', function(changedModule){
        if( changedModule === module.urlpath ) {
            walkDir();
        }
    });
    walkDir();

    function walkDir() {
        count++;
        console.log('Build '+module.urlpath+':'+count+' @ '+new Date().toISOString()+' ...');
            
        var f;
        var walker = walk.walk(module.filepath, {});
        
        var file = {
            html : [],
            js : []
        }
        
        walker.on('file', function (root, fileStats, next) {
            var f = localPath(root, fileStats.name);
            
            if( f.match(/\.html$/i) ) {
                file.html.push(f);
                watch.set(module.urlpath, fileStats.name);
            } else if ( f.match(/.js$/i) ) {
                file.js.push(f);
            }
            
            next();
        });
        
        walker.on('directory', function (root, fileStats, next) {
            watch.set(module.urlpath, fileStats.name);
            next();
        });
        
        walker.on('errors', function (root, nodeStatsArray, next) {
            console.error(`Error walking: ${module.filepath}`);
            next();
        });
        
        walker.on("end", function () {
            onWalkComplete(file);
        });
    }


    function onWalkComplete(file) {
        var html = file.html.map(function(name) {
            return `<link rel="import" href="/${module.urlpath}${name}" />`;
        });
        html.push(`<script src="/${module.urlpath}/_dev_index.js"></script>`);
        
        moduleStore.set(`/${module.urlpath}/_dev_index.html`, html.join('\n'));
        
        build(file);
    }

    function build(files) {
        var b = browserify(config.browserify);
        
        files.js.forEach(function(name){
            b.add(path.join(module.filepath, name));
        });
        
        b.pipeline.on('file', function (file, id, parent) {
           watch.set(module.urlpath, file);
        });
        
        b.transform('babelify', config.babel)
        .bundle(function(err, resp){
        if( err ) {
            return console.log(err.stack);
        }
        moduleStore.set(`/${module.urlpath}/_dev_index.js`, resp);
        console.log('Build '+module.urlpath+':'+count+' Complete @ '+new Date().toISOString()+'\n');
        
        if( count === 1 ) {
            console.log(`Now serving ${module.urlpath}: http://localhost:${config.port}/${module.urlpath}/_dev_index.html`);
        }
        });
    }

    function localPath(root, name) {
        return path.join(root, name).replace(module.filepath, '');
    }
}
