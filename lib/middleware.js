var moduleStore = require('./moduleStore');

module.exports = function(config) {
    var config = require('./config')(config);
    
    require('./init');

    return function(req, res, next) {

        for( var i = 0; i < config.modules.length; i++ ) {
            var htmlImportsfile = moduleStore.get(req.path);
            if( htmlImportsfile ) {
                if( req.path.match(/.html$/) ) {
                    res.set('Content-Type', 'text/html');
                } else {
                    res.set('Content-Type', 'application/js');
                }
                res.send(htmlImportsfile);
                return;
            }
        }
        
        next();
    }
}

