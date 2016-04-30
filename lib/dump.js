var Vulcanize = require('vulcanize');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var async = require('async');
var path = require('path');

var build = require('./build');
var moduleStore = require('./moduleStore');

module.exports = function(config) {
    config = require('./config')(config);
    
    if( !config.dump.match(/^\//) ) {
        config.dump = path.join(process.cwd(), config.dump);
    }
    
    async.eachSeries(
        config.modules,
        function(moduleDef, next) {
            build(moduleDef, function(files) {
                concat(moduleDef, config, writeTmpFiles(config, files), next);
            });
        },
        function(err) {
            console.log('done');
            process.exit(1);
        }
    )
}

function writeTmpFiles(config, files) {
    
    var htmlContents = moduleStore.get(`/${files.html}`);
    var jsContents = moduleStore.get(`/${files.js}`);
    
    var htmlPath = path.join.apply(null, files.html.split('/'));
    var jsPath = path.join.apply(null, files.js.split('/'));
    
    var htmlPathFull = path.join(config.root, htmlPath);
    var jsPathFull = path.join(config.root, jsPath);
    
    fs.writeFileSync(htmlPathFull, htmlContents);
    fs.writeFileSync(jsPathFull, jsContents);
    
    return {
        html: htmlPath,
        htmlTmp : htmlPathFull,
        js: jsPath,
        jsTmp : jsPathFull
    }
}

function concat(moduleDef, config, target, callback) {
    var vulcan = new Vulcanize({
        abspath: config.root,
        inlineScripts: true,
        inlineCss: true
    });

    vulcan.process(target.html, function(err, inlinedHtml) {
        fs.unlinkSync(target.htmlTmp);
        fs.unlinkSync(target.jsTmp);

        if( err ) {
            console.log(err);
            return callback();
        }
        
        mkdirp(config.dump, function (err) {
            if( err ) {
                console.log(err);
            } else {
                fs.writeFileSync(path.join(config.dump, moduleDef.name)+'.html', inlinedHtml);
            }

            callback();
        });
    });
}