var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var rest = require('./rest');

var app = {
    user : '',
    init : function(user) {
       this.user = user;
       
       rest.getUser(user, (err, resp) => {
          ee.emit('user-load', resp.body); 
       });
       
       rest.getUserOrgs(user, (err, resp) => {
          ee.emit('user-orgs-load', resp.body); 
       });
    },
    on : function(e, fn) {
        ee.on(e, fn);
    }
}

module.exports = app;