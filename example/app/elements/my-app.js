var app = require('../../shared');
var ReactDOM = require('react-dom');
var React = require('react');

import angularComponent from '../angular/main';
import OrgTable from '../react/OrgTable';

Polymer({
    is: 'my-app',
    
    ready : function() {
        var orgs = [];
        
        app.on('user-orgs-load', (data) => {
           this.table.setState({orgs: data}); 
        });

       this.table = ReactDOM.render(<OrgTable />, this.$.table);
    },
    
    onKeypress : function(e) {
        if( e.which === 13 ) {
            app.init(this.$.input.value);
        }
    }
});