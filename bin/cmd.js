#! /usr/bin/env node

var program = require('commander');
var path = require('path');
 
program
  .version(require('../package.json').version)
  .option('-r, --root [path]', 'Full path to root folder to serve')
  .option('-m, --module [url path]', 'Relative path from root folder to module')
  .option('-n, --name [module name]', 'Name for module import file.  ex: foo, produces foo.html')
  .option('-t, --typescript', 'TypeScript compile required')
  .option('-c, --config [path]', 'Full path to config file')
  .option('-d, --dump [path]', 'Build and dump as single HTML Import.  Path is dump location.')
  .parse(process.argv);

var config = {};
if( program.config ) {
    config = require(program.config);
} else if( program.root && program.module ) {
    config.root = program.root;
    
    if( !config.root.match(/^\// ) ) {
        config.root = path.join(process.cwd(), config.root);
    }
    
    var name = null;
    // the commander has a 'name' function. Don't use that.
    if( typeof program.name !== 'function' ) {
        name = program.name;
    }

    config.modules = [{
        urlpath: program.module,
        name : name
    }];
} else {
    program.outputHelp();
    console.log('');
    console.log('  You must provide either a -c config or -r root & -m module path');
    console.log('');
    
    return;
}

if( program.dump ) {
    config.dump = program.dump;
    require('../lib/dump')(config);
    return;
}

if( program.typescript ) {
    config.typescript = true;
}

require('../server')(config);