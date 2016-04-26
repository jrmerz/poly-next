var app = require('../../../shared');

Polymer({
    is: 'app-header',
    ready : function() {
        app.on('user-load', (user) => {
            this.$.brand.innerHTML = user.name
        });
    }
});