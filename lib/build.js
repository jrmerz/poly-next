var walk = require('walk');
var path = require('path');

var config = require('./config')();
var browserify = require('browserify');
var moduleStore = require('./moduleStore');
var watch = require('./watch');

var pendingRebuild = {
    timer : -1,
    recompile : false
}

module.exports = function(module) {
    
    var count = 0;
    
    watch.on('rebuild', function(e){
        if( e.changedModule === module.urlpath ) {
            if( pendingRebuild.timer !== -1 ) {
                clearTimeout(pendingRebuild.timer);
            }
            if( e.file.match(/\.js$/i) ) {
                pendingRebuild.recompile = true;
            }
            
            pendingRebuild.timer = setTimeout(() => {
                pendingRebuild.timer = -1;
                var recompile = pendingRebuild.recompile;
                pendingRebuild.recompile = false;
                
                walkDir(recompile);
            }, 200);
        }
    });
    walkDir(true);

    function walkDir(recompile) {
        count++;
        console.log('\nBuilding '+module.urlpath+':'+count+' @ '+new Date().toISOString()+' ...');
            
        // watch to root dir
        watch.set(module.urlpath, module.filepath);
            
        var f;
        // walk to entire directory for subdirectories, js and html files
        var walker = walk.walk(module.filepath, {});
        
        var file = {
            html : [],
            js : []
        }
        
        walker.on('file', function (root, fileStats, next) {
            var f = localPath(root, fileStats.name);
            
            if( f.match(/\.html$/i) ) {
                file.html.push(f);
                watch.set(module.urlpath, path.join(root, fileStats.name));
            } else if ( f.match(/.js$/i) ) {
                // do not watch js files here, this will be handled 
                // during the browserify process so modules outside this directory
                // trigger rebuilds
                file.js.push(f);
            }
            
            next();
        });
        
        walker.on('directory', function (root, fileStats, next) {
            watch.set(module.urlpath, path.join(root, fileStats.name));
            next();
        });
        
        walker.on('errors', function (root, nodeStatsArray, next) {
            console.error(`Error walking: ${module.filepath}`);
            next();
        });
        
        walker.on('end', function () {
            // we have all required files now
            // time to create html import files
            onWalkComplete(file, recompile);
        });
    }


    function onWalkComplete(file, recompile) {
        var html = file.html.map(function(name) {
            return `<link rel="import" href="/${module.urlpath}${name}" />`;
        });
        html.push(`<script src="/${module.urlpath}/_dev_index.js"></script>`);
        
        moduleStore.set(`/${module.urlpath}/_dev_index.html`, html.join('\n'));
        
        // if only a directory or html file changed, no need to recompile
        if( !recompile ) {
            console.log('Build '+module.urlpath+':'+count+' Complete @ '+new Date().toISOString()+' (no recompile required)\n');
            return;
        }
        
        build(file);
    }

    function build(files) {
        var b = browserify(config.browserify);
        
        // add all of our js files to the browserify build
        files.js.forEach(function(name){
            b.add(path.join(module.filepath, name));
        });
        
        // watch all required modules 
        b.pipeline.on('file', function (file, id, parent) {
           watch.set(module.urlpath, file);
        });
        
        // compile, set results
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
