#! /usr/bin/env node

var program = require('commander');
var path = require('path');
 
program
  .version(require('../package.json').version)
  .option('-r, --root [path]', 'Full path to root folder to serve')
  .option('-m, --module [url path]', 'Relative path from root folder to module')
  .option('-c, --config [path]', 'Full path to config file')
  .parse(process.argv);

var config = {};
if( program.config ) {
    config = require(program.config);
} else if( program.root && program.module ) {
    config.root = program.root;
    
    if( !config.root.match(/^\// ) ) {
        config.root = path.join(process.cwd(), config.root);
    }
    
    config.modules = [{
        urlpath: program.module 
    }];
} else {
    program.outputHelp();
    console.log('');
    console.log('  You must provide either a -c config or -r root & -m module path');
    console.log('');
    
    return;
}

require('../server')(config);